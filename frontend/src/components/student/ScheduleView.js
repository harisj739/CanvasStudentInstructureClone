import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year=&semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
    const [schedules, setSchedules] = useState([]);
    const [message, setMessage] = useState('');
    const [schedule, setSchedule] = useState({year:'', semester:''});


    const fetchSchedule = async () => {
        if (schedule.year==='' || schedule.semester==='') {
            setMessage("Enter search parameters");
        }
        else {
            try {
                const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=${schedule.year}&semester=${schedule.semester}`);
                if (response.ok) {
                    const json = await response.json();
                    setSchedules(json);
                } else {
                    const json = await response.json();
                    setMessage("response error: " + json.message);
                }
            } catch (err) {
                setMessage("network error: " + err);
            }
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const editChange = (event) => {
        setSchedule({...schedule,  [event.target.name]:event.target.value});
    }

    const dropCourse = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setMessage("Course dropped");
                fetchSchedule();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    return (
        <>
            <h3>Your Schedule</h3>
            <h4>{message}</h4>
            <h4>Enter term year and semester. Example 2024 Spring.</h4>
            <table className="Center">
                <tbody>
                <tr>
                    <td>Year:</td>
                    <td><input type="text" id="year" name="year" value={schedule.year} onChange={editChange}/></td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td><input type="text" id="semester" name="semester" value={schedule.semester}
                               onChange={editChange}/></td>
                </tr>
                </tbody>
            </table>
            <br/>
            <button type="submit" id="search" onClick={fetchSchedule}>Search for Schedule</button>
            <br/>
            <br/>
            <table className="Center">
                <thead>
                <tr>
                    <th>CourseId</th>
                    <th>Title</th>
                    <th>SectionId</th>
                    <th>Building</th>
                    <th>Room</th>
                    <th>Times</th>
                    <th>Credits</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {schedules.map((s) => (
                    <tr key={s.enrollmentId}>
                        <td>{s.courseId}</td>
                        <td>{s.title}</td>
                        <td>{s.sectionId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td>{s.credits}</td>
                        <td>
                            <button onClick={() => dropCourse(s.enrollmentId)}>Drop</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default ScheduleView;
