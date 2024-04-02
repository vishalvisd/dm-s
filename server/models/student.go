package models

import (
	"database/sql"
	"errors"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"time"
)

var DB *sql.DB

type Education struct {
	Institute   string  `json:"institute"`
	PassOutYear int     `json:"passoutyear"`
	Score       float32 `json:"score"`
}

type Student struct {
	Id        int         `json:"id"`
	FirstName string      `json:"first_name"`
	LastName  string      `json:"last_name"`
	Email     string      `json:"email"`
	Phone     int         `json:"phone"`
	Education []Education `json:"education"`
}

type StudentsResponse struct {
	Fields [5]string
	Values [][5]string
}

const (
	DB_NAME   = "dm_student.db"
	MIN_PHONE = 5000000000
	MAX_PHONE = 9999999999
	MIN_SCORE = 0
	MAX_SCORE = 9999.99
	PAGE_SIZE = 10
)

func ConnectDatabase() error {
	db, err := sql.Open("sqlite3", fmt.Sprintf("./data/%s", DB_NAME))
	if err != nil {
		return err
	}

	// Create Student Table if not exits
	_, err = db.Exec(` CREATE TABLE IF NOT EXISTS student ( 
		  id integer PRIMARY KEY autoincrement,
		  first_name varchar(40),
		  last_name varchar(40),
		  email varchar(50) UNIQUE,
		  phone varchar(10) UNIQUE
		)
	`)
	if err != nil {
		return err
	}

	// Create Education Table if not exits with studentId as foreign key to Student table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS education ( 
		  id integer PRIMARY KEY autoincrement,
		  institute varchar(50),
		  passoutyear integer,
		  score integer,
		  studentId integer,
		  FOREIGN KEY(studentId) REFERENCES student(id)
		)
	`)
	if err != nil {
		return err
	}

	// Commit to DB
	db.Close()

	db1, err := sql.Open("sqlite3", fmt.Sprintf("./data/%s", DB_NAME))
	DB = db1

	return nil

}

func GetStudents(page int) (StudentsResponse, error) {
	getStudentsQuery := fmt.Sprintf(`
							SELECT student.first_name,
								   student.last_name,
								   student.email,
								   student.phone,
								   Group_concat(Concat_ws(',', education.institute, education.passoutyear, ROUND(education.score, 2)), '||') AS education
							FROM student
							JOIN education
							ON student.id = education.studentid
							WHERE studentid IN (
								SELECT id
								FROM   student
								LIMIT  %d offset %d
							)
							GROUP  BY student.id`, PAGE_SIZE, (page-1)*10)

	studentRows, err := DB.Query(getStudentsQuery)
	if err != nil {
		return StudentsResponse{}, err
	}

	defer studentRows.Close()

	students := make([][5]string, 0)
	for studentRows.Next() {
		var student [5]string

		err = studentRows.Scan(&student[0], &student[1], &student[2], &student[3], &student[4])
		if err != nil {
			return StudentsResponse{}, err
		}

		students = append(students, student)
	}

	err = studentRows.Err()
	if err != nil {
		return StudentsResponse{}, err
	}

	studentResponse := StudentsResponse{
		Fields: [5]string{"first_name", "last_name", "email", "phone", "education"},
		Values: students,
	}

	return studentResponse, err
}

func validateNumericMinMax(val float64, min float64, max float64) bool {
	if val < min || val > max {
		return false
	}
	return true
}

func AddStudent(student Student) (bool, error) {
	// Validations that is not possible as constraint with sqlite
	if !validateNumericMinMax(float64(student.Phone), MIN_PHONE, MAX_PHONE) {
		return false, errors.New("Number format error [Phone]")
	}
	for _, education := range student.Education {
		year, _, _ := time.Now().Date()
		if !validateNumericMinMax(float64(education.PassOutYear), 1900, float64(year)) {
			return false, errors.New("Number format error [Passout Year]")
		}
		if !validateNumericMinMax(float64(education.Score), MIN_SCORE, MAX_SCORE) {
			return false, errors.New("Number format error [Score]")
		}
	}
	// - Input validation complete

	tx, err := DB.Begin()
	if err != nil {
		return false, err
	}

	query := `INSERT INTO student (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)`
	res, err := tx.Exec(query, student.FirstName, student.LastName, student.Email, student.Phone)
	if err != nil {
		tx.Rollback() // Rollback the transaction if there's an error
		return false, err
	}

	// Retrieve the last inserted row ID in student table
	foreignKey, err := res.LastInsertId()
	if err != nil {
		tx.Rollback() // Rollback the transaction if there's an error
		return false, err
	}

	query = `INSERT INTO education (institute, passoutyear, score, studentId) VALUES (?, ?, ?, ?)`
	for _, education := range student.Education {
		_, err = tx.Exec(query, education.Institute, education.PassOutYear, education.Score, foreignKey)

		if err != nil {
			tx.Rollback() // Rollback the transaction if there's an error
			return false, err
		}

	}
	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return false, err
	}

	return true, nil
}

func StudentCount() (int, error) {
	query := `SELECT COUNT(*) as count FROM student`

	row, err := DB.Query(query)
	if err != nil {
		return 0, err
	}
	var count int
	for row.Next() {
		err = row.Scan(&count)
		if err != nil {
			return 0, err
		}
	}
	return count, nil
}
