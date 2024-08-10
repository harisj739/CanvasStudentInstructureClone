import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
// import CourseUpdate from './CourseUpdate';
import CourseAdd from './CourseAdd';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

function CoursesView(props) {
    // The last two string literals are for the "Update" button and "Delete" button.
    const headers = ['CourseId', 'Title', 'Credits',  '', ''];
    
    const [courses, setCourses] = useState([    ]);

    const [ message, setMessage ] = useState('');

    const [ editRow, setEditRow ] = useState(-1); //-1 means that no row is being edited. Otherwise it is the row index of the row being edited.

    const [ editCourse, setEditCourse ] = useState({courseId: '', title: '', credits: ''}) // The course being edited.

    const  fetchCourses = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/courses`);
        if (response.ok) {
          const courses = await response.json();
          setCourses(courses);
        } else {
          const json = await response.json();
          setMessage("response error: "+json.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }  
    }

    useEffect( () => { 
      fetchCourses();
    },  []);

    const addCourse = async (course) => {
      try {
        const response = await fetch (`${SERVER_URL}/courses`, 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }, 
              body: JSON.stringify(course),
            });
        if (response.ok) {
          setMessage("course added")
          fetchCourses();
        } else {
          const rc = await response.json();
          setMessage(rc.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }
    }

    const doSave = () => {
        setEditRow(-1);
        saveCourse(editCourse);
    }

    const saveCourse = async (course) => {
        try {
            const response = await fetch (`${SERVER_URL}/courses`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(course),
                });
            if (response.ok) {
                setMessage("course saved")
                fetchCourses();
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const deleteCourse = async (courseId) => {
      try {
        const response = await fetch (`${SERVER_URL}/courses/${courseId}`, 
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }, 
            });
        if (response.ok) {
          setMessage("Course deleted");
          fetchCourses();
        } else {
          const rc = await response.json();
          setMessage("Delete failed "+rc.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }
    }
    
    const onDelete = (e) => {
        // Row index uses the parent node (<td>) to access <td>'s parent node's (<tr) row index. The header row is considered index 0 and so we subtract 1.
      const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
      const courseId = courses[row_idx].courseId;
      confirmAlert({
          title: 'Confirm to delete',
          message: 'Do you really want to delete?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => deleteCourse(courseId)
            },
            {
              label: 'No',
            }
          ]
        });
    }

    const onEdit = (event) => {
        const row_idx = event.target.parentNode.parentNode.rowIndex - 1;
        const c = courses[row_idx];
        setEditCourse({...c});
        setEditRow(row_idx);
    }

    const editChange = (event) => {
        setEditCourse({...editCourse,  [event.target.name]:event.target.value})
    }

    const displayCourse = (c, idx) => {
        if (editRow !== idx) {
            return (
                <tr key={c.courseId}>
                    <td>{c.courseId}</td>
                    <td>{c.title}</td>
                    <td>{c.credits}</td>
                    <td><Button onClick={onEdit}/>Edit</td>
                    <td><Button onClick={onDelete}>Delete</Button></td>
                </tr>
            );
        } else {
            return (
                <tr key={c.courseId}>
                    <td>{c.courseId}/></td>
                    <td><input type={"text"} name={"title"} value={editCourse.title} onChange={editChange}/></td>
                    <td><input type={"text"} name={"credits"} value={editCourse.credits} onChange={editChange}/></td>
                    <td><Button onClick={doSave}/>Save</td>
                    <td></td>
                </tr>
            );
        }

    }

    return (
        <div>
            <h3>Courses</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {courses.map((c, idx) => (
                    displayCourse(c, idx)
                    ))}
                </tbody>
            </table>
            <CourseAdd save={addCourse} />
        </div>
    );
}
export default CoursesView;

