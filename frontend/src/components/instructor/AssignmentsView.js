import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import {SERVER_URL} from "../../Constants";
import {confirmAlert} from "react-confirm-alert";
import Button from "@mui/material/Button";
import AssignmentUpdate from "./AssignmentUpdate";
import AssignmentAdd from "./AssignmentAdd";
import AssignmentGrade from "./AssignmentGrade";

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;
    const headers = ['AssignmentId', 'Title', 'Due Date', '', '', ''];
    const [assignments, setAssignments] = useState([     ]);
    const [message, setMessage] = useState('');
    const [assignment, setAssignment] = useState({title:'', dueDate:''});
    const [editRow, setEditRow ] = useState(-1); //-1 means that no row is being edited. Otherwise it is the row index of the row being edited.

    const  fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok) {
                const assignments = await response.json();
                setAssignments(assignments);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    } // fetchAssignments

    useEffect( () => {
        fetchAssignments();
    },  []);


    const addAssignment = async (assignment) => {
        assignment.courseId = courseId;
        assignment.secId = secId;
        assignment.secNo = secNo;
        try {
            const response = await fetch (`${SERVER_URL}/assignments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                const rc = await response.json();
                setAssignment(assignment);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const deleteAssignment = async (id) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }


    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value});
    }

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const id = assignments[row_idx].id;
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteAssignment(id)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const displayAssignment = (a, idx) => {
        if (editRow !== idx) {
            return (
                <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.title}</td>
                    <td>{a.dueDate}</td>
                    <td><AssignmentGrade assignment={a} onClose={fetchAssignments}/></td>
                    <td><AssignmentUpdate assignment={a} onClose={fetchAssignments}/></td>
                    <td><Button onClick={onDelete}>Delete</Button></td>
                </tr>
            );
        } else {
            setEditRow(-1);
            return (
                <tr key={a.id}>
                    <td>{a.id}/></td>
                    <td><input type={"text"} name={"title"} value={assignment.title} onChange={editChange}/></td>
                    <td><input type={"text"} name={"dueDate"} value={assignment.dueDate} onChange={editChange}/></td>
                    <td><AssignmentUpdate assignment={a} onClose={fetchAssignments}/></td>
                    <td></td>
                </tr>
            );
        }

    }
     
    return(
        <>
            <h3>Assignments</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a, idx) => (
                    displayAssignment(a, idx)
                ))}
                </tbody>
            </table>
            <AssignmentAdd save={addAssignment}/>
        </>
    );
}

export default AssignmentsView;
