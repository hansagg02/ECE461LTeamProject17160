import React, { useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Logout from './Logout';

function Projects() {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = location.state?.userID || location.state?.newUserID || ''; 
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [createProjectID, setCreateProjectID] = useState('');
    const [joinProjectID, setJoinProjectID] = useState('');

    const handleSetProjectName = (event) => {
        setProjectName(event.target.value);
    }

    const handleSetDescription = (event) => {
        setDescription(event.target.value);
    }
    
    const handleSetCreateProjectID = (event) => {
         setCreateProjectID(event.target.value);
     }

    const handleSetJoinProjectID = (event) => { 
        setJoinProjectID(event.target.value);
    }

    const handleCreateProject = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/create_project', {
                projectName,
                description,
                createProjectID,
                userID
            });
    
            if (response.data.code === 200) {
                navigate('/hardware', { state: { userID: userID, projectName: projectName } });
            } 
        } catch (error) {
            alert("Error creating project: Project ID already exists.");
        }
        
    };

    const handleJoinProject = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/join_project', {
                joinProjectID,
                userID
            });
            if (response.data.code === 200) {
                navigate('/hardware', { state: { userID: userID, projectName: response.data.projectName } });
            } 
        } catch (error) {
            alert("Error joining project: Project ID does not exist");
        }
        
    };
   
    return (
        <div>
            <Logout/> 
            <br /><br />
            <h2>Create Project</h2>
            <form onSubmit={handleCreateProject}>
                Project Name:
                <input type="text" value={projectName} onChange={handleSetProjectName} placeholder="Project Name" required />
                <br /><br />
                Description:
                <input type="text" value={description} onChange={handleSetDescription} placeholder="Description" required />
                <br /><br />
                Project ID:
                <input type="text" value={createProjectID} onChange={handleSetCreateProjectID} placeholder="ProjectID" required />
                <br /><br />
                <button type="submit">Create Project</button>
            </form> 
            <br /><br /><br />
            <h2>Join Existing Project</h2>
            <form onSubmit = {handleJoinProject}>
            Project Name:
                <br />
                <input type="text" value={joinProjectID} onChange={handleSetJoinProjectID} placeholder="ProjectID" required />
                <button type="submit">Join Project</button>
            </form>
        </div>
    );
}

export default Projects;