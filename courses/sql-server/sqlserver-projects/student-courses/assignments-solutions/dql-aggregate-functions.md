![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Count total students
SELECT COUNT(*) AS total_students FROM student_courses.students;
-- 2. Count total courses
SELECT COUNT(*) AS total_courses FROM student_courses.courses;
-- 3. Count total semesters
SELECT COUNT(*) AS total_semesters FROM student_courses.semesters;
-- 4. Count total enrollments
SELECT COUNT(*) AS total_enrollments FROM student_courses.student_courses;
-- 5. Count distinct students enrolled
SELECT COUNT(DISTINCT student_id) AS distinct_students_enrolled FROM student_courses.student_courses;
-- 6. Count distinct courses enrolled
SELECT COUNT(DISTINCT course_id) AS distinct_courses_enrolled FROM student_courses.student_courses;
-- 7. Count students per course
SELECT course_id, COUNT(student_id) AS students_count
  FROM student_courses.student_courses
  GROUP BY course_id;
-- 8. Count courses per student
SELECT student_id, COUNT(course_id) AS courses_count
  FROM student_courses.student_courses
  GROUP BY student_id;
-- 9. Count courses offered per semester
SELECT semester_id, COUNT(course_id) AS courses_offered
  FROM student_courses.courses
  GROUP BY semester_id;
-- 10. Count students enrolled per semester
SELECT c.semester_id, COUNT(sc.student_id) AS students_count
  FROM student_courses.courses AS c
  JOIN student_courses.student_courses AS sc ON c.course_id = sc.course_id
  GROUP BY c.semester_id;
```

## Sum
```sql
-- 1. Sum of credits for all courses
SELECT SUM(credits) AS total_credits FROM student_courses.courses;
-- 2. Sum of credits per semester
SELECT semester_id, SUM(credits) AS total_credits
  FROM student_courses.courses
  GROUP BY semester_id;
-- 3. Sum of credits taken by each student
SELECT s.student_id, SUM(c.credits) AS credits_sum
  FROM student_courses.students AS s
  JOIN student_courses.student_courses AS sc ON s.student_id = sc.student_id
  JOIN student_courses.courses AS c ON sc.course_id = c.course_id
  GROUP BY s.student_id;
-- 4. Sum of credits taken by student 11
SELECT SUM(c.credits) AS credits_sum
  FROM student_courses.student_courses AS sc
  JOIN student_courses.courses AS c ON sc.course_id = c.course_id
  WHERE sc.student_id = 11;
-- 5. Sum of credits of courses with credits > 3
SELECT SUM(credits) AS sum_large_credits
  FROM student_courses.courses
  WHERE credits > 3;
-- 6. Sum of credits in 'Fall 2024'
SELECT SUM(c.credits) AS fall_2024_credits
  FROM student_courses.courses AS c
  JOIN student_courses.semesters AS sem ON c.semester_id = sem.semester_id
  WHERE sem.semester_name = 'Fall 2024';
-- 7. Sum of semester durations in days
SELECT SUM(DATEDIFF(day, start_date, end_date)) AS total_semester_days
  FROM student_courses.semesters;
-- 8. Sum of full name lengths for all students
SELECT SUM(LEN(first_name + ' ' + last_name)) AS total_name_chars
  FROM student_courses.students;
-- 9. Sum of course name lengths for all courses
SELECT SUM(LEN(course_name)) AS total_course_name_chars
  FROM student_courses.courses;
-- 10. Sum of credits for 'Introduction' courses
SELECT SUM(credits) AS intro_credits
  FROM student_courses.courses
  WHERE course_name LIKE '%Introduction%';
```

## Avg
```sql
-- 1. Average credits per course
SELECT AVG(credits) AS avg_credits FROM student_courses.courses;
-- 2. Average credits per semester
SELECT semester_id, AVG(credits) AS avg_credits
  FROM student_courses.courses
  GROUP BY semester_id;
-- 3. Average credits taken per student
SELECT AVG(c_sum) AS avg_credits_per_student
  FROM (
    SELECT student_id, SUM(c.credits) AS c_sum
      FROM student_courses.student_courses AS sc
      JOIN student_courses.courses AS c ON sc.course_id = c.course_id
      GROUP BY student_id
  ) AS t;
-- 4. Average number of courses per student
SELECT AVG(course_count) AS avg_courses_per_student
  FROM (
    SELECT student_id, COUNT(*) AS course_count
      FROM student_courses.student_courses
      GROUP BY student_id
  ) AS t;
-- 5. Average number of students per course
SELECT AVG(student_count) AS avg_students_per_course
  FROM (
    SELECT course_id, COUNT(*) AS student_count
      FROM student_courses.student_courses
      GROUP BY course_id
  ) AS t;
-- 6. Average semester duration in days
SELECT AVG(DATEDIFF(day, start_date, end_date)) AS avg_semester_days
  FROM student_courses.semesters;
-- 7. Average student name length
SELECT AVG(LEN(first_name + ' ' + last_name)) AS avg_name_length
  FROM student_courses.students;
-- 8. Average email length
SELECT AVG(LEN(email)) AS avg_email_length
  FROM student_courses.students;
-- 9. Average courses offered per semester
SELECT AVG(course_count) AS avg_courses_offered
  FROM (
    SELECT semester_id, COUNT(*) AS course_count
      FROM student_courses.courses
      GROUP BY semester_id
  ) AS t;
-- 10. Average enrollment month number
SELECT AVG(DATEPART(month, enrollment_date)) AS avg_enrollment_month
  FROM student_courses.students;
```

## Max
```sql
-- 1. Maximum credits of any course
SELECT MAX(credits) AS max_credits FROM student_courses.courses;
-- 2. Maximum number of students in a course
SELECT MAX(student_count) AS max_students
  FROM (
    SELECT course_id, COUNT(*) AS student_count
      FROM student_courses.student_courses
      GROUP BY course_id
  ) AS t;
-- 3. Maximum number of courses taken by a student
SELECT MAX(course_count) AS max_courses
  FROM (
    SELECT student_id, COUNT(*) AS course_count
      FROM student_courses.student_courses
      GROUP BY student_id
  ) AS t;
-- 4. Maximum length of student full name
SELECT MAX(LEN(first_name + ' ' + last_name)) AS max_name_length
  FROM student_courses.students;
-- 5. Maximum length of course name
SELECT MAX(LEN(course_name)) AS max_course_name_length
  FROM student_courses.courses;
-- 6. Latest enrollment date
SELECT MAX(enrollment_date) AS latest_enrollment
  FROM student_courses.students;
-- 7. Latest semester end date
SELECT MAX(end_date) AS latest_semester_end
  FROM student_courses.semesters;
-- 8. Maximum semester duration in days
SELECT MAX(DATEDIFF(day, start_date, end_date)) AS max_semester_days
  FROM student_courses.semesters;
-- 9. Maximum total credits taken by a student
SELECT MAX(total_credits) AS max_credits_by_student
  FROM (
    SELECT student_id, SUM(c.credits) AS total_credits
      FROM student_courses.student_courses AS sc
      JOIN student_courses.courses AS c ON sc.course_id = c.course_id
      GROUP BY student_id
  ) AS t;
-- 10. Maximum email length
SELECT MAX(LEN(email)) AS max_email_length
  FROM student_courses.students;
```

## Min
```sql
-- 1. Minimum credits of any course
SELECT MIN(credits) AS min_credits FROM student_courses.courses;
-- 2. Minimum number of students in a course
SELECT MIN(student_count) AS min_students
  FROM (
    SELECT course_id, COUNT(*) AS student_count
      FROM student_courses.student_courses
      GROUP BY course_id
  ) AS t;
-- 3. Minimum number of courses taken by a student
SELECT MIN(course_count) AS min_courses
  FROM (
    SELECT student_id, COUNT(*) AS course_count
      FROM student_courses.student_courses
      GROUP BY student_id
  ) AS t;
-- 4. Minimum length of student full name
SELECT MIN(LEN(first_name + ' ' + last_name)) AS min_name_length
  FROM student_courses.students;
-- 5. Minimum length of course name
SELECT MIN(LEN(course_name)) AS min_course_name_length
  FROM student_courses.courses;
-- 6. Earliest enrollment date
SELECT MIN(enrollment_date) AS earliest_enrollment
  FROM student_courses.students;
-- 7. Earliest semester start date
SELECT MIN(start_date) AS earliest_semester_start
  FROM student_courses.semesters;
-- 8. Minimum semester duration in days
SELECT MIN(DATEDIFF(day, start_date, end_date)) AS min_semester_days
  FROM student_courses.semesters;
-- 9. Minimum total credits taken by a student
SELECT MIN(total_credits) AS min_credits_by_student
  FROM (
    SELECT student_id, SUM(c.credits) AS total_credits
      FROM student_courses.student_courses AS sc
      JOIN student_courses.courses AS c ON sc.course_id = c.course_id
      GROUP BY student_id
  ) AS t;
-- 10. Minimum email length
SELECT MIN(LEN(email)) AS min_email_length
  FROM student_courses.students;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
