![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. Retrieve all semesters
SELECT * 
FROM student_courses.semesters;

-- 2. Retrieve each student’s ID and full name
SELECT 
  student_id, 
  first_name + ' ' + last_name AS full_name 
FROM student_courses.students;

-- 3. Retrieve all courses with their credit values
SELECT 
  course_name, 
  credits 
FROM student_courses.courses;

-- 4. Retrieve each semester’s name and its date range
SELECT 
  semester_name, 
  start_date, 
  end_date 
FROM student_courses.semesters;

-- 5. Retrieve each student’s full name and enrollment date
SELECT 
  first_name + ' ' + last_name AS student, 
  enrollment_date 
FROM student_courses.students;

-- 6. Retrieve all enrollments (junction table)
SELECT * 
FROM student_courses.student_courses;

-- 7. Retrieve distinct semester IDs from the courses table
SELECT DISTINCT semester_id 
FROM student_courses.courses;

-- 8. Retrieve all student emails
SELECT email 
FROM student_courses.students;

-- 9. Retrieve student names with their enrolled course IDs
SELECT 
  s.first_name + ' ' + s.last_name AS student, 
  sc.course_id 
FROM student_courses.students AS s
JOIN student_courses.student_courses AS sc 
  ON s.student_id = sc.student_id;

-- 10. Retrieve course names together with the semester they’re offered in
SELECT 
  c.course_name, 
  sem.semester_name 
FROM student_courses.courses AS c
JOIN student_courses.semesters AS sem 
  ON c.semester_id = sem.semester_id;
```

## WHERE
```sql
-- 1. Courses offered in Spring 2024 (semester_id = 2)
SELECT * 
FROM student_courses.courses 
WHERE semester_id = 2;

-- 2. Students who enrolled after January 1, 2024
SELECT * 
FROM student_courses.students 
WHERE enrollment_date > '2024-01-01';

-- 3. Courses worth 4 credits
SELECT * 
FROM student_courses.courses 
WHERE credits = 4;

-- 4. Semesters starting in 2025
SELECT * 
FROM student_courses.semesters 
WHERE start_date >= '2025-01-01';

-- 5. Students whose last name starts with 'M'
SELECT * 
FROM student_courses.students 
WHERE last_name LIKE 'M%';

-- 6. Enrollments for student ID = 15
SELECT * 
FROM student_courses.student_courses 
WHERE student_id = 15;

-- 7. Students with email domain 'example.com'
SELECT * 
FROM student_courses.students 
WHERE email LIKE '%@example.com';

-- 8. Courses containing 'Introduction'
SELECT * 
FROM student_courses.courses 
WHERE course_name LIKE '%Introduction%';

-- 9. Semesters that end before August 1, 2025
SELECT * 
FROM student_courses.semesters 
WHERE end_date < '2025-08-01';

-- 10. Enrollments in courses 1, 2, or 3
SELECT * 
FROM student_courses.student_courses 
WHERE course_id IN (1,2,3);
```

## GROUP BY
```sql
-- 1. Count of students by enrollment year
SELECT 
  YEAR(enrollment_date) AS year, 
  COUNT(*) AS student_count 
FROM student_courses.students
GROUP BY YEAR(enrollment_date);

-- 2. Number of courses offered per semester
SELECT 
  sem.semester_name, 
  COUNT(*) AS courses_offered 
FROM student_courses.courses AS c
JOIN student_courses.semesters AS sem 
  ON c.semester_id = sem.semester_id
GROUP BY sem.semester_name;

-- 3. Total credits per semester
SELECT 
  c.semester_id, 
  SUM(credits) AS total_credits 
FROM student_courses.courses AS c
GROUP BY c.semester_id;

-- 4. Number of enrollments per course
SELECT 
  course_id, 
  COUNT(*) AS enrollment_count 
FROM student_courses.student_courses
GROUP BY course_id;

-- 5. Number of courses by credit value
SELECT 
  credits, 
  COUNT(*) AS num_courses 
FROM student_courses.courses
GROUP BY credits;

-- 6. Students enrolled per month
SELECT 
  MONTH(enrollment_date) AS month, 
  COUNT(*) AS count 
FROM student_courses.students
GROUP BY MONTH(enrollment_date);

-- 7. Average credits offered per semester
SELECT 
  semester_id, 
  AVG(credits) AS avg_credits 
FROM student_courses.courses
GROUP BY semester_id;

-- 8. Number of courses each student is enrolled in
SELECT 
  student_id, 
  COUNT(*) AS courses_taken 
FROM student_courses.student_courses
GROUP BY student_id;

-- 9. Number of students per semester (via join)
SELECT 
  c.semester_id, 
  COUNT(DISTINCT sc.student_id) AS student_count 
FROM student_courses.student_courses AS sc
JOIN student_courses.courses AS c 
  ON sc.course_id = c.course_id
GROUP BY c.semester_id;

-- 10. Maximum credits offered in any semester
SELECT 
  semester_id, 
  MAX(credits) AS max_credits 
FROM student_courses.courses
GROUP BY semester_id;
```

## HAVING
```sql
-- 1. Semesters offering more than 3 courses
SELECT 
  semester_id, 
  COUNT(*) AS course_count 
FROM student_courses.courses
GROUP BY semester_id
HAVING COUNT(*) > 3;

-- 2. Students enrolled in more than 2 courses
SELECT 
  student_id, 
  COUNT(*) AS course_count 
FROM student_courses.student_courses
GROUP BY student_id
HAVING COUNT(*) > 2;

-- 3. Semesters with total credits exceeding 12
SELECT 
  semester_id, 
  SUM(credits) AS total_credits 
FROM student_courses.courses
GROUP BY semester_id
HAVING SUM(credits) > 12;

-- 4. Courses with more than 5 students
SELECT 
  course_id, 
  COUNT(*) AS student_count 
FROM student_courses.student_courses
GROUP BY course_id
HAVING COUNT(*) > 5;

-- 5. Credit values assigned to more than 2 courses
SELECT 
  credits, 
  COUNT(*) AS num_courses 
FROM student_courses.courses
GROUP BY credits
HAVING COUNT(*) > 2;

-- 6. Semesters offering at least 4 courses
SELECT 
  semester_id, 
  COUNT(*) AS course_count 
FROM student_courses.courses
GROUP BY semester_id
HAVING COUNT(*) >= 4;

-- 7. Students taking at least 3 courses
SELECT 
  student_id, 
  COUNT(*) AS course_count 
FROM student_courses.student_courses
GROUP BY student_id
HAVING COUNT(*) >= 3;

-- 8. Courses with average student enrollments > 1
SELECT 
  course_id, 
  COUNT(*)*1.0/COUNT(DISTINCT course_id) AS avg_enrollments 
FROM student_courses.student_courses
GROUP BY course_id
HAVING COUNT(*)*1.0/COUNT(DISTINCT course_id) > 1;

-- 9. Enrollment months with more than 5 new students
SELECT 
  MONTH(enrollment_date) AS month, 
  COUNT(*) AS new_students 
FROM student_courses.students
GROUP BY MONTH(enrollment_date)
HAVING COUNT(*) > 5;

-- 10. Semesters where average course credit > 3.5
SELECT 
  semester_id, 
  AVG(credits) AS avg_credit 
FROM student_courses.courses
GROUP BY semester_id
HAVING AVG(credits) > 3.5;
```

## ORDER BY
```sql
-- 1. Students ordered by last name ascending
SELECT * 
FROM student_courses.students
ORDER BY last_name ASC;

-- 2. Students ordered by enrollment date descending
SELECT * 
FROM student_courses.students
ORDER BY enrollment_date DESC;

-- 3. Courses ordered by credit value descending
SELECT * 
FROM student_courses.courses
ORDER BY credits DESC;

-- 4. Courses ordered by name ascending
SELECT * 
FROM student_courses.courses
ORDER BY course_name ASC;

-- 5. Semesters ordered by start date ascending
SELECT * 
FROM student_courses.semesters
ORDER BY start_date ASC;

-- 6. Students ordered by first name ascending
SELECT * 
FROM student_courses.students
ORDER BY first_name ASC;

-- 7. Enrollments ordered by student then course
SELECT * 
FROM student_courses.student_courses
ORDER BY student_id, course_id;

-- 8. Courses ordered by semester then credits
SELECT * 
FROM student_courses.courses
ORDER BY semester_id ASC, credits DESC;

-- 9. Students ordered by enrollment year descending
SELECT * 
FROM student_courses.students
ORDER BY YEAR(enrollment_date) DESC;

-- 10. Courses ordered by name length descending
SELECT * 
FROM student_courses.courses
ORDER BY LEN(course_name) DESC;
```

## TOP
```sql
-- 1. Top 5 most recently enrolled students
SELECT TOP 5 * 
FROM student_courses.students
ORDER BY enrollment_date DESC;

-- 2. Top 3 courses with highest credit value
SELECT TOP 3 * 
FROM student_courses.courses
ORDER BY credits DESC;

-- 3. Top 10 courses by enrollment count
SELECT TOP 10 
  sc.course_id, 
  COUNT(*) AS enrollment_count 
FROM student_courses.student_courses AS sc
GROUP BY sc.course_id
ORDER BY COUNT(*) DESC;

-- 4. Semester offering the most courses
SELECT TOP 1 
  semester_id, 
  COUNT(*) AS course_count 
FROM student_courses.courses
GROUP BY semester_id
ORDER BY COUNT(*) DESC;

-- 5. Top 5 students by number of courses taken
SELECT TOP 5 
  student_id, 
  COUNT(*) AS courses_taken 
FROM student_courses.student_courses
GROUP BY student_id
ORDER BY COUNT(*) DESC;

-- 6. Top 5 courses alphabetically
SELECT TOP 5 * 
FROM student_courses.courses
ORDER BY course_name ASC;

-- 7. Top 3 semesters by total credits offered
SELECT TOP 3 
  semester_id, 
  SUM(credits) AS total_credits 
FROM student_courses.courses
GROUP BY semester_id
ORDER BY SUM(credits) DESC;

-- 8. Top 5 students with longest names
SELECT TOP 5 
  student_id, 
  LEN(first_name + ' ' + last_name) AS name_length 
FROM student_courses.students
ORDER BY LEN(first_name + ' ' + last_name) DESC;

-- 9. Top 3 courses by student diversity (distinct students)
SELECT TOP 3 
  sc.course_id, 
  COUNT(DISTINCT sc.student_id) AS distinct_students 
FROM student_courses.student_courses AS sc
GROUP BY sc.course_id
ORDER BY COUNT(DISTINCT sc.student_id) DESC;

-- 10. Top 10 enrollments (highest student_id values)
SELECT TOP 10 * 
FROM student_courses.student_courses
ORDER BY student_id DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
