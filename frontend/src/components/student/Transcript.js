import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcripts?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const [transcript, setTranscript] = useState([]);
    const [message, setMessage] = useState('');

    const fetchTranscript = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=${3}`);
            if (response.ok) {
                const json = await response.json();
                setTranscript(json);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    useEffect(() => {
        fetchTranscript();
    }, []);

    return (
        <>
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>CourseId</th>
                        <th>SectionId</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.map((t) => (
                        <tr key={t.enrollmentId}>
                            <td>{t.year}</td>
                            <td>{t.semester}</td>
                            <td>{t.courseId}</td>
                            <td>{t.sectionId}</td>
                            <td>{t.title}</td>
                            <td>{t.credits}</td>
                            <td>{t.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Transcript;
