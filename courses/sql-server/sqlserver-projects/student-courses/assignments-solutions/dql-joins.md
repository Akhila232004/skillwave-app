![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. List all students with their enrolled course names.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name
FROM student_courses.students s
INNER JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
INNER JOIN student_courses.courses c ON sc.course_id = c.course_id;

-- 2. List all courses with semester names.
SELECT c.course_id, c.course_name, sem.semester_name
FROM student_courses.courses c
INNER JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 3. List each enrollment with student name, course name, and semester name.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name, sem.semester_name
FROM student_courses.student_courses sc
INNER JOIN student_courses.students s ON sc.student_id = s.student_id
INNER JOIN student_courses.courses c ON sc.course_id = c.course_id
INNER JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 4. List each student and the total credits they are enrolled in.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, SUM(c.credits) AS total_credits
FROM student_courses.students s
INNER JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
INNER JOIN student_courses.courses c ON sc.course_id = c.course_id
GROUP BY s.student_id, s.first_name, s.last_name;

-- 5. List courses with number of students enrolled.
SELECT c.course_id, c.course_name, COUNT(sc.student_id) AS student_count
FROM student_courses.courses c
INNER JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
GROUP BY c.course_id, c.course_name;

-- 6. List semesters with count of courses offered.
SELECT sem.semester_id, sem.semester_name, COUNT(c.course_id) AS course_count
FROM student_courses.semesters sem
INNER JOIN student_courses.courses c ON sem.semester_id = c.semester_id
GROUP BY sem.semester_id, sem.semester_name;

-- 7. List students enrolled in 'Database Systems'.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name
FROM student_courses.students s
INNER JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
INNER JOIN student_courses.courses c ON sc.course_id = c.course_id
WHERE c.course_name = 'Database Systems';

-- 8. List courses taken by students who enrolled after '2024-01-01'.
SELECT DISTINCT c.course_id, c.course_name
FROM student_courses.courses c
INNER JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
INNER JOIN student_courses.students s ON sc.student_id = s.student_id
WHERE s.enrollment_date > '2024-01-01';

-- 9. List students and their semester names.
SELECT DISTINCT s.student_id, s.first_name + ' ' + s.last_name AS student_name, sem.semester_name
FROM student_courses.students s
INNER JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
INNER JOIN student_courses.courses c ON sc.course_id = c.course_id
INNER JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 10. List semesters where 'John Doe' has enrolled.
SELECT DISTINCT sem.semester_id, sem.semester_name
FROM student_courses.semesters sem
INNER JOIN student_courses.courses c ON sem.semester_id = c.semester_id
INNER JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
INNER JOIN student_courses.students s ON sc.student_id = s.student_id
WHERE s.first_name = 'John' AND s.last_name = 'Doe';
```

## Left Join (Left Outer Join)
```sql
-- 1. List all students and their course names, including students with no enrollments.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id;

-- 2. List all courses and number of students enrolled, including courses with zero enrollments.
SELECT c.course_id, c.course_name, COUNT(sc.student_id) AS student_count
FROM student_courses.courses c
LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
GROUP BY c.course_id, c.course_name;

-- 3. List all semesters and courses, including semesters with no courses.
SELECT sem.semester_id, sem.semester_name, c.course_name
FROM student_courses.semesters sem
LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id;

-- 4. List all students and their semester names, including students with no enrollments.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, sem.semester_name
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
LEFT JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 5. List all course names and credit values, and student count if any.
SELECT c.course_id, c.course_name, c.credits, COUNT(sc.student_id) AS student_count
FROM student_courses.courses c
LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
GROUP BY c.course_id, c.course_name, c.credits;

-- 6. List students and total credits, including students with zero credits.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, SUM(c.credits) AS total_credits
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
GROUP BY s.student_id, s.first_name, s.last_name;

-- 7. List all semesters and total credits offered, including semesters with zero courses.
SELECT sem.semester_id, sem.semester_name, SUM(c.credits) AS total_credits
FROM student_courses.semesters sem
LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id
GROUP BY sem.semester_id, sem.semester_name;

-- 8. List students with course_name where credit > 3, including students with no such courses.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id AND c.credits > 3;

-- 9. List all courses and student last names, including courses with no students.
SELECT c.course_id, c.course_name, s.last_name
FROM student_courses.courses c
LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
LEFT JOIN student_courses.students s ON sc.student_id = s.student_id;

-- 10. List all students and whether they are enrolled in 'Machine Learning'.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name,
       CASE WHEN c.course_name = 'Machine Learning' THEN 'Yes' ELSE 'No' END AS enrolled_ml
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id AND c.course_name = 'Machine Learning';
```

## Right Join (Right Outer Join)
```sql
-- 1. List all students and the courses they take, including students with no enrollments.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.students s ON sc.student_id = s.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id;

-- 2. List all courses and their enrolled students’ last names, including courses with no enrollments.
SELECT c.course_id, c.course_name, s.last_name
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.courses c ON sc.course_id = c.course_id
LEFT JOIN student_courses.students s ON sc.student_id = s.student_id;

-- 3. List all semesters and courses offered, including semesters with no courses.
SELECT sem.semester_id, sem.semester_name, c.course_name
FROM student_courses.courses c
RIGHT JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 4. List all courses and the count of students, including courses with zero enrollments.
SELECT c.course_id, c.course_name, COUNT(sc.student_id) AS student_count
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.courses c ON sc.course_id = c.course_id
GROUP BY c.course_id, c.course_name;

-- 5. List all students and total credits, including students with zero credits.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, SUM(c.credits) AS total_credits
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.students s ON sc.student_id = s.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
GROUP BY s.student_id, s.first_name, s.last_name;

-- 6. List all semesters and the total number of courses offered.
SELECT sem.semester_id, sem.semester_name, COUNT(c.course_id) AS course_count
FROM student_courses.courses c
RIGHT JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id
GROUP BY sem.semester_id, sem.semester_name;

-- 7. List all students and whether they’re enrolled in 'Algorithms'.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name,
       CASE WHEN c.course_name = 'Algorithms' THEN 'Yes' ELSE 'No' END AS enrolled_algorithms
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.students s ON sc.student_id = s.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id AND c.course_name = 'Algorithms';

-- 8. List all courses and student IDs, including courses with no students.
SELECT c.course_id, c.course_name, sc.student_id
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.courses c ON sc.course_id = c.course_id;

-- 9. List all students and semesters they have courses in, including students with no courses.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, sem.semester_name
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.students s ON sc.student_id = s.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
LEFT JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 10. List all semesters and student counts, including semesters with no students.
SELECT sem.semester_id, sem.semester_name, COUNT(sc.student_id) AS student_count
FROM student_courses.student_courses sc
RIGHT JOIN student_courses.courses c ON sc.course_id = c.course_id
RIGHT JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id
GROUP BY sem.semester_id, sem.semester_name;
```

## Full Join (Full Outer Join)
```sql
-- 1. List all students and enrollments, showing null where no pair.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, sc.course_id
FROM student_courses.students s
FULL JOIN student_courses.student_courses sc ON s.student_id = sc.student_id;

-- 2. List all courses and enrollments, showing null where no pair.
SELECT c.course_id, c.course_name, sc.student_id
FROM student_courses.courses c
FULL JOIN student_courses.student_courses sc ON c.course_id = sc.course_id;

-- 3. List semesters and courses, including unmatched in either.
SELECT sem.semester_id, sem.semester_name, c.course_id, c.course_name
FROM student_courses.semesters sem
FULL JOIN student_courses.courses c ON sem.semester_id = c.semester_id;

-- 4. List students and courses with credits, even if no enrollments.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name, c.credits
FROM student_courses.students s
FULL JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
FULL JOIN student_courses.courses c ON sc.course_id = c.course_id;

-- 5. List courses and semesters, including unmatched entries.
SELECT c.course_id, c.course_name, sem.semester_id, sem.semester_name
FROM student_courses.courses c
FULL JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 6. List students and their last enrolled semester, even if none.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, sem.semester_name
FROM student_courses.students s
FULL JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
FULL JOIN student_courses.courses c ON sc.course_id = c.course_id
FULL JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;

-- 7. List semesters and student IDs, including unmatched.
SELECT sem.semester_id, sem.semester_name, sc.student_id
FROM student_courses.semesters sem
FULL JOIN student_courses.courses c ON sem.semester_id = c.semester_id
FULL JOIN student_courses.student_courses sc ON c.course_id = sc.course_id;

-- 8. List all students and courses, even if no link between them.
SELECT s.student_id, c.course_id
FROM student_courses.students s
FULL JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
FULL JOIN student_courses.courses c ON sc.course_id = c.course_id;

-- 9. List all courses and students, even if no link.
SELECT c.course_id, sc.student_id
FROM student_courses.courses c
FULL JOIN student_courses.student_courses sc ON c.course_id = sc.course_id;

-- 10. List students and course names, including unmatched.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_name
FROM student_courses.students s
FULL JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
FULL JOIN student_courses.courses c ON sc.course_id = c.course_id;
```

## Cross Join
```sql
-- 1. List every student-course combination (Cartesian product).
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_id, c.course_name
FROM student_courses.students s
CROSS JOIN student_courses.courses c;

-- 2. List every semester-course combination.
SELECT sem.semester_name, c.course_name
FROM student_courses.semesters sem
CROSS JOIN student_courses.courses c;

-- 3. List every student-semester combination.
SELECT s.first_name + ' ' + s.last_name AS student_name, sem.semester_name
FROM student_courses.students s
CROSS JOIN student_courses.semesters sem;

-- 4. List every student-course-semester combination.
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name,
       c.course_id, c.course_name, sem.semester_name
FROM student_courses.students s
CROSS JOIN student_courses.courses c
CROSS JOIN student_courses.semesters sem;

-- 5. List all students with each semester they could enroll in.
SELECT s.student_id, sem.semester_id
FROM student_courses.students s
CROSS JOIN student_courses.semesters sem;

-- 6. List pairs of all courses (self cross join).
SELECT c1.course_name AS course1, c2.course_name AS course2
FROM student_courses.courses c1
CROSS JOIN student_courses.courses c2;

-- 7. List every student with each '4-credit' course option.
SELECT s.student_id, c.course_name
FROM student_courses.students s
CROSS JOIN student_courses.courses c
WHERE c.credits = 4;

-- 8. List only combinations where student_id < course_id.
SELECT s.student_id, c.course_id
FROM student_courses.students s
CROSS JOIN student_courses.courses c
WHERE s.student_id < c.course_id;

-- 9. List every student paired with every other student.
SELECT s1.student_id AS student1, s2.student_id AS student2
FROM student_courses.students s1
CROSS JOIN student_courses.students s2;

-- 10. List every semester with each student for '2025' semesters.
SELECT sem.semester_name, s.student_id
FROM student_courses.semesters sem
CROSS JOIN student_courses.students s
WHERE sem.start_date >= '2025-01-01';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
