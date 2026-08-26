![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. Retrieve students enrolled on '2023-08-01'
2. Retrieve courses with credits = 4
3. Retrieve the semester named 'Fall 2023'
4. Retrieve enrollments for student_id = 1
5. Retrieve courses offered in semester_id = 2
6. Retrieve students with last_name = 'Doe'
7. Retrieve the course named 'Database Systems'
8. Retrieve the semester that starts on '2024-01-15'
9. Retrieve the student with email = 'john.doe@example.com'
10. Retrieve enrollments for course_id = 5

## Inequality Operator (<>)
1. Students not enrolled on '2025-03-01'
2. Courses with credits <> 3
3. Semesters where semester_id <> 4
4. Enrollments where student_id <> 10
5. Courses not offered in semester_id = 2
6. Students whose first_name <> 'John'
7. Courses whose course_name <> 'Calculus I'
8. Semesters with start_date <> '2025-06-01'
9. Students whose email <> 'jane.smith@example.com'
10. Enrollments where course_id <> 3

## IN Operator
1. Students with student_id IN (1,2,3)
2. Courses with credits IN (3,4)
3. Semesters with semester_id IN (1,3,5)
4. Enrollments for course_id IN (1,2,3)
5. Students with last_name IN ('Doe','Smith')
6. Courses offered in semesters IN (2,4)
7. Students with email IN ('john.doe@example.com','jane.smith@example.com')
8. Courses with course_id IN (5,6,7)
9. Enrollments for student_id IN (11,12,13)
10. Semesters named IN ('Fall 2023','Spring 2024')

## NOT IN Operator
1. Students with student_id NOT IN (1,2,3)
2. Courses with credits NOT IN (3)
3. Semesters with semester_id NOT IN (1,5)
4. Enrollments where course_id NOT IN (1,4,7)
5. Students with last_name NOT IN ('Doe','Smith')
6. Courses not offered in semesters NOT IN (2,3)
7. Students with email NOT IN ('john.doe@example.com','jane.smith@example.com')
8. Courses with course_id NOT IN (2,5,8)
9. Enrollments where student_id NOT IN (11,12)
10. Semesters named NOT IN ('Summer 2024','Fall 2024')

## LIKE Operator
1. Students with email LIKE '%@example.com'
2. Courses where course_name LIKE 'Introduction%'
3. Semesters with semester_name LIKE '%2024'
4. Students where last_name LIKE 'M%'
5. Courses where course_name LIKE '%Data%'
6. Semesters with semester_name LIKE 'Fall%'
7. Students where first_name LIKE '_a%'
8. Courses where course_name LIKE '%ing%'
9. Students where email LIKE '%martinez%'
10. Courses where course_name LIKE '%Systems'

## NOT LIKE Operator
1. Students with email NOT LIKE '%@example.com'
2. Courses where course_name NOT LIKE '%Introduction%'
3. Semesters where semester_name NOT LIKE '%2025'
4. Students where last_name NOT LIKE 'D%'
5. Courses where course_name NOT LIKE '%Data%'
6. Semesters where semester_name NOT LIKE 'Summer%'
7. Students where first_name NOT LIKE '_a%'
8. Courses where course_name NOT LIKE '%ing%'
9. Students where email NOT LIKE '%jessica%'
10. Courses where course_name NOT LIKE '%Systems'

## BETWEEN Operator
1. Students with enrollment_date BETWEEN '2023-08-01' AND '2023-08-10'
2. Courses with credits BETWEEN 3 AND 4
3. Semesters with start_date BETWEEN '2024-01-01' AND '2025-01-01'
4. Students with student_id BETWEEN 5 AND 15
5. Courses with course_id BETWEEN 3 AND 8
6. Semesters with end_date BETWEEN '2024-05-15' AND '2025-05-15'
7. Students with student_id BETWEEN 10 AND 20
8. Courses with credits BETWEEN 2 AND 4
9. Semesters with semester_id BETWEEN 2 AND 4
10. Enrollments where student_id BETWEEN 1 AND 10

## Greater Than (>)
1. Students with enrollment_date > '2024-01-01'
2. Courses with credits > 3
3. Semesters with semester_id > 4
4. Enrollments where course_id > 5
5. Students with student_id > 10
6. Courses with course_id > 8
7. Semesters with end_date > '2024-12-31'
8. Students with enrollment_date > '2025-01-01'
9. Courses with credits > 2
10. Enrollments where student_id > 5

## Greater Than or Equal To (>=)
1. Students with enrollment_date >= '2024-01-15'
2. Courses with credits >= 4
3. Semesters with semester_id >= 3
4. Enrollments where course_id >= 5
5. Students with student_id >= 15
6. Semesters with start_date >= '2025-06-01'
7. Courses with credits >= 3
8. Students with enrollment_date >= '2023-12-01'
9. Semesters with end_date >= '2025-05-15'
10. Enrollments where student_id >= 10

## Less Than (<)
1. Students with enrollment_date < '2024-01-01'
2. Courses with credits < 4
3. Semesters with semester_id < 3
4. Enrollments where course_id < 5
5. Students with student_id < 5
6. Semesters with start_date < '2024-06-01'
7. Courses with credits < 3
8. Students with enrollment_date < '2023-09-01'
9. Semesters with end_date < '2024-12-15'
10. Enrollments where student_id < 3

## Less Than or Equal To (<=)
1. Students with enrollment_date <= '2024-01-15'
2. Courses with credits <= 3
3. Semesters with semester_id <= 3
4. Enrollments where course_id <= 5
5. Students with student_id <= 5
6. Semesters with start_date <= '2024-09-01'
7. Courses with credits <= 4
8. Students with enrollment_date <= '2023-08-05'
9. Semesters with end_date <= '2025-05-15'
10. Enrollments where student_id <= 10

## EXISTS Operator
1. Courses that have at least one enrollment
2. Students enrolled in at least one course
3. Semesters that offer at least one course
4. Students enrolled in course 1
5. Courses with enrollments by student 11
6. Students who have taken a 4-credit course
7. Semesters that have at least one 4-credit course
8. Courses in which 'Smith' is enrolled
9. Students enrolled in courses with course_id > 10
10. Semesters in which student 13 has a course

## NOT EXISTS Operator
1. Courses with no enrollments
2. Students not enrolled in any course
3. Semesters that offer no courses
4. Students not enrolled in course 1
5. Courses not offered in semester 3
6. Students who have not taken a 4-credit course
7. Courses not taken by student 11
8. Semesters in which student 13 has no courses
9. Students who have not enrolled in courses with course_id > 10
10. Courses with no students named 'Smith'

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
