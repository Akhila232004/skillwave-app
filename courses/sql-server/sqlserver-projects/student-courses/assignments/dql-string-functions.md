![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Retrieve length of each student's first name
2. Retrieve length of each student's last name
3. Retrieve length of each course name
4. Retrieve length of each email address
5. Retrieve length of each semester name
6. Retrieve length of full student name (first + space + last)
7. Find courses with name length > 15
8. Order students by descending first name length
9. List top 5 longest emails
10. Count how many students have a first name length of exactly 4

## Substring Function (SUBSTRING)
1. Get first 3 letters of each student's first name
2. Get last 3 letters of each student's last name
3. Get course name prefix (first 5 characters)
4. Extract username from email (before '@')
5. Extract domain from email (after '@')
6. Extract year part from semester_name (e.g. '2024')
7. Get middle portion of a course name (chars 3–7)
8. Extract month/day from enrollment_date as text
9. Show 4-letter code from credits value (e.g. '4   ')
10. Extract first word of semester_name

## Concatenation Operator (+)
1. Concatenate first and last names into full name
2. Show student with email in parentheses
3. Prefix course names with semester name
4. Combine course name and credits
5. Create a label for semester with dates
6. Tag students with ID in name
7. Combine student name and number of courses taken
8. Concatenate email domain to student name
9. Create unique code: first letter of first and last name
10. Build full course code: semester ID + course ID

## Lower Function (LOWER)
1. Convert all emails to lowercase
2. Normalize course names to lowercase
3. Lowercase student full names
4. Lowercase semester names
5. Find courses containing 'data' case-insensitively
6. Compare email domains ignoring case
7. List distinct lowercase first names
8. Lowercase and trim whitespace
9. Lowercase credits concatenation
10. Order courses by lowercase name

## Upper Function (UPPER)
1. Convert all emails to uppercase
2. Normalize course names to uppercase
3. Uppercase student full names
4. Uppercase semester names
5. Find students whose uppercase last name starts with 'SM'
6. Uppercase and trim whitespace
7. Uppercase credits concatenation
8. Order students by uppercase last name
9. Uppercase substring of course name
10. Uppercase domain check

## Trim Function (TRIM)
1. Trim spaces from first names
2. Trim spaces from last names
3. Trim spaces from course names
4. Trim spaces from semester names
5. Find 'Mary' despite trailing space
6. Count students whose trimmed full name length > 10
7. Order courses by trimmed name
8. Show trimmed email
9. Label semesters with trimmed name
10. Trim and concatenate student names

## Ltrim Function (LTRIM)
1. Remove leading spaces from first names
2. LTRIM email addresses
3. LTRIM course names
4. LTRIM semester names
5. Find names after LTRIM
6. LTRIM and then LEN
7. LTRIM in concatenation
8. LTRIM and LEFT
9. LTRIM and LOWER
10. LTRIM and SUBSTRING

## Rtrim Function (RTRIM)
1. Remove trailing spaces from first names
2. RTRIM email addresses
3. RTRIM course names
4. RTRIM semester names
5. Find names after RTRIM
6. RTRIM and LEN
7. RTRIM in concatenation
8. RTRIM and RIGHT
9. RTRIM and UPPER
10. RTRIM and SUBSTRING

## Charindex Function (CHARINDEX)
1. Position of '@' in each email
2. Position of space in each course name
3. Position of '2025' in semester_name
4. Position of 'son' in last_name
5. Position of '-' in formatted dates
6. Position of first vowel in first_name (e.g. 'a')
7. Position of second space in full name
8. Position of 'Data' in course_name
9. Position of '.' in email
10. Use CHARINDEX to split email domain

## Left Function (LEFT)
1. First two letters of each first name
2. First three letters of each last name
3. Email user name (before '@')
4. First five letters of course name
5. First four characters (term) of semester_name
6. Leftmost digit of credits
7. First letter of first and last name
8. LEFT and UPPER combined
9. LEFT with SUBSTRING
10. LEFT with concatenation

## Right Function (RIGHT)
1. Last two letters of each first name
2. Last three letters of each last name
3. Email domain (after '@')
4. Last five letters of course name
5. Last four chars of semester_name
6. RIGHT and UPPER
7. RIGHT with CONCAT
8. RIGHT and REPLACE
9. RIGHT and LEN filter
10. RIGHT with TRIM

## Reverse Function (REVERSE)
1. Reverse each first name
2. Reverse each last name
3. Reverse course names
4. Reverse email strings
5. Reverse semester names
6. Reverse full names
7. Reverse and LEFT
8. Reverse and SUBSTRING
9. Reverse domain part of email
10. Reverse semester label

## Replace Function (REPLACE)
1. Replace '@' with ' [at] ' in emails
2. Replace spaces with underscores in course names
3. Replace '2024' with 'Year2024' in semester_name
4. Replace 'a' with '@' in last names
5. Replace 'e' with '3' in first names
6. Replace 'Computer' with 'CS' in course names
7. Replace 'Spring' with 'Sp' in semester_name
8. Replace dashes in dates
9. Replace empty email with placeholder
10. Replace credits number with text

## Case Statement (CASE)
1. Label credits as 'High' (>=4) or 'Low'
2. Categorize students by enrollment year
3. Grade courses by credits
4. Show semester season from name
5. Flag students with long names
6. Indicate if email is example.com
7. Show if a student has enrollments
8. Credit bracket by range
9. Semester length category
10. Combine CASE and CONCAT

## ISNULL Function (ISNULL)
1. Replace null last names with 'Unknown'
2. Replace null course names with 'No Course'
3. Show 0 when credits is null
4. Replace null semester_id in courses with -1
5. Replace null email with placeholder
6. ISNULL in concatenation
7. Default enrollment_date if null (use today)
8. Use ISNULL on CHARINDEX result
9. ISNULL with SUM of credits
10. ISNULL on DATEDIFF result

## Coalesce Function (COALESCE)
1. Use COALESCE to pick first non-null between two names
2. COALESCE email or default
3. COALESCE credits or 0
4. COALESCE semester_name or 'TBD'
5. COALESCE in concatenation
6. COALESCE on join result: show course or 'None'
7. COALESCE on CHARINDEX
8. COALESCE on SUBSTRING
9. COALESCE on CASE
10. COALESCE in GROUP BY context

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
