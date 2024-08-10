import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';
import EnrollmentUpdate from "./EnrollmentUpdate";
import {SERVER_URL} from '../../Constants';

// instructor view list of students enrolled in a section
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />


const EnrollmentsView = (props) => {

    const [enrollments, setEnrollments] = useState([]);
    const headers = ['EnrollmentId', 'StudentId', 'Name',  'Email', 'Grade', ''];
    const [message, setMessage] = useState('');
    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const fetchEnrollments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
            if(response.ok){
                const enrollments = await response.json();
                setEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: " +json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect( () => {
        fetchEnrollments();
    }, [] );



    const onSave = async (enrollment) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([enrollment]),
                });
            if(response.ok) {
                setMessage("Grade saved");
                fetchEnrollments();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err)
        }
    }

    return(
        <>
            <h3>Enrollments</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((h, idx) => <th>{h}</th>)}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((enrollment) =>
                    <tr key={enrollment.enrollmentId}>
                        <td>{enrollment.enrollmentId}</td>
                        <td>{enrollment.studentId}</td>
                        <td>{enrollment.name}</td>
                        <td>{enrollment.email}</td>
                        <td>{enrollment.grade}</td>
                        <td><EnrollmentUpdate enrollment={enrollment} save={onSave} /></td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

export default EnrollmentsView;
