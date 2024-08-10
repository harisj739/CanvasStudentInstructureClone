import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EnrollmentUpdate = (props) => {

    const [isOpen, setOpen] = useState(false);
    const [message, setMessage]= useState('');
    const [enrollment, setEnrollment] = useState({enrollmentId: '', studentId: '', name: '', email: '', grade: ''});

    const editOpen = () => {
        setOpen(true);
        setMessage('');
        setEnrollment(props.enrollment);
    }

    const editClose = () => {
        setOpen(false);
    }

    const editChange = (event) => {
        setEnrollment({...enrollment, [event.target.name]: event.target.value})
    }

    const onSave = () => {
        if(enrollment.grade===''){
            setMessage("grade can not be empty");
        }
        else {
            props.save(enrollment);
            editClose();
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Edit</Button>
            <Dialog open={isOpen}>
                <DialogTitle>Edit Grade</DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <h4>{message}</h4>
                    <TextField style={{padding:10}} fullWidth label="enrollmentId" name="enrollmentId" value={enrollment.enrollmentId} InputProps={{readOnly: true, }} />
                    <TextField style={{padding:10}} fullWidth label="studentId" name="studentId" value={enrollment.studentId} InputProps={{readOnly: true, }} />
                    <TextField style={{padding:10}} fullWidth label="name" name="name" value={enrollment.name} InputProps={{readOnly: true, }} />
                    <TextField style={{padding:10}} fullWidth label="email" name="email" value={enrollment.email} InputProps={{readOnly: true, }} />
                    <TextField style={{padding:10}} autoFocus fullWidth label="grade" name="grade" value={enrollment.grade} onChange={editChange} />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EnrollmentUpdate;
