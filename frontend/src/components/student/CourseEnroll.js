import React, {useState, useEffect} from 'react';
import SectionUpdate from "../admin/SectionUpdate";
import Button from "@mui/material/Button";
import SectionAdd from "../admin/SectionAdd";
import {SERVER_URL} from "../../Constants";
import {confirmAlert} from "react-confirm-alert";

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {

    const [sections, setSections] = useState([]);
    const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', ''];
    const [message, setMessage] = useState('');

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/open`);
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch(err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchSections();
    }, [] );

    const onEnroll = (e) => {
        // Row index uses the parent node (<td>) to access <td>'s parent node's (<tr) row index. The header row is considered index 0 and so we subtract 1.
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const sectionNo = parseInt(sections[row_idx].secNo);
        confirmAlert({
            title: 'Confirm to enroll',
            message: 'Do you really want to enroll?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => addEnroll(sectionNo)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const addEnroll = async (sectionNo) => {
        try {
            const response = await fetch (`${SERVER_URL}/enrollments/sections/${sectionNo}?studentId=3`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sectionNo),
                });
            if (response.ok) {
                const rc = await response.json();
                setMessage("enrollment added secno="+ sectionNo);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }


    return(
        <div>
            <h3>Sections</h3>

            <h4>{message}</h4>
            <h4>Enroll in an open section</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                    <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Button onClick={onEnroll}>Enroll</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;
