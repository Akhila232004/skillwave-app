![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. For each student, total courses taken
2. For each course, number of students enrolled
3. Average credits across all courses
4. Sum of credits per semester
5. Average credits per student
6. Max credit single course per semester
7. Min credits course per student
8. Cumulative count of courses ordered by course_id
9. Running sum of credits per semester
10. Distinct semesters count per student

## ROW_NUMBER()
1. Row number for students by enrollment date
2. Row number per semester for courses by credits desc
3. Row number per student for their enrollments by course_id
4. Sequential enrollment ID
5. Top 3 courses per semester
6. Row number for semesters by start_date desc
7. Row number for courses by name
8. Row number per enrollment by student
9. Row number for students partitioned by enrollment year
10. Row number for courses partitioned by credit value

## RANK()
1. Rank students by total courses taken
2. Rank courses by student count
3. Rank semesters by number of courses offered
4. Rank courses by credits
5. Rank students by name length
6. Rank enrollments by student_id
7. Rank semesters by start_date
8. Rank courses partitioned by semester by credits
9. Rank students partitioned by enrollment year by student_id
10. Rank semesters by duration days

## DENSE_RANK()
1. Dense rank students by total courses
2. Dense rank courses by student count
3. Dense rank semesters by course count
4. Dense rank courses by credits
5. Dense rank students by name length
6. Dense rank enrollments by course_id
7. Dense rank semesters by start_date
8. Dense rank courses partitioned by semester by credits
9. Dense rank students partitioned by year by student_id
10. Dense rank semesters by duration

## NTILE(n)
1. Quartiles of students by enrollment_date
2. Tertiles of courses by credits
3. Halves of semesters by start_date
4. Quintiles of students by name length
5. Quartiles of courses by student count
6. Pentiles of semesters by course count
7. Quartiles of students by distinct semesters
8. Tertiles of courses by cumulative courses
9. Halves of enrollments by student_id
10. Quartiles of semester duration

## LAG()
1. Previous course_id per student
2. Previous enrollment_date per student
3. Previous end_date per semester
4. Previous credits by course ordered by course_id
5. Previous student full name by enrollment_date
6. Previous semester_name per course
7. Previous student count per course
8. Previous enrollment_seq
9. Previous semester start_date
10. Previous average credits per student

## LEAD()
1. Next course_id per student
2. Next enrollment_date per student
3. Next end_date per semester
4. Next credits by course
5. Next student full name by enrollment_date
6. Next semester_name per course_id
7. Next student count per course
8. Next enrollment_seq
9. Next semester start_date
10. Next average credits per student

## FIRST_VALUE()
1. First course by credits per semester
2. First student by enrollment date
3. First semester start_date overall
4. First course in alphabetic order
5. First enrollment per student
6. First student by last_name
7. First semester by end_date
8. First course by student count
9. First student per enrollment year
10. First course code (semester-course)

## LAST_VALUE()
1. Last course by credits per semester
2. Last student by enrollment date
3. Last semester start_date overall
4. Last course in alphabetic order
5. Last enrollment per student
6. Last student by last_name
7. Last semester by end_date
8. Last course by student count
9. Last student per enrollment year
10. Last course code (semester-course)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
