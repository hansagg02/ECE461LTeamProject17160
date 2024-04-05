
    
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import Logout from './Logout';

function Projects() {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = location.state?.userID || location.state?.newUserID || ''; 
    const [user, setUser] = useState({ username: '', id: '', valid: false });
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectID, setProjectId] = useState('');
    const [projectjoinId, setProjectjoinId] = useState('');
    const [projectMessage, setProjectMessage] = useState('');
    const [joinMessage, setJoinMessage] = useState('');
    const [joinProjectID, setJoinProjectId] = useState('');
    const [userProjects, setUserProjects] = useState([]);
    const [loggedIn, setLoggedIn] = useState(true);


    const handleSetProjectName = (event) => {
            setProjectName(event.target.value);
        }

    const handleSetDescription = (event) => {
            setDescription(event.target.value);
        }
    
    const handleSetProjectId = (event) => {
         setProjectId(event.target.value);
     }

    const handleSetjoinMessage = (event) => {
        setJoinMessage(event.target.value);
    }

    const handleSetJoinProjectId = (event) => { 
        setJoinProjectId(event.target.value);
    }

    const handleCreateProject = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/create_project', {
                projectName,
                description,
                projectID,
                userID
            });
    
            if (response.data.code === 200) {
                setProjectMessage("Project created successfully!");
                navigate('/hardware', { state: { projectName: projectName } });
            } else {
                setProjectMessage("Response code: " + response.data.code + " Response message: " + response.data.error);
            }
        } catch (error) {
            setProjectMessage("Error creating project: " + error.message);
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
                setProjectName(response.data.projectName);
                setJoinMessage("Project added successfully!");
                navigate('/hardware', { state: { projectName: projectName } });
            } else {
                setJoinMessage("Response code: " + response.data.code + " Response message: " + response.data.error);
            }
        } catch (error) {
            setJoinMessage("Error joining project: " + error.message);
        }
        
    };
   
    return (
        <div>
            <Logout/> 
            <h3>Create project</h3>
            <form onSubmit={handleCreateProject}>
                <label>
                    Project Name:
                    <input type="text" value={projectName} onChange={handleSetProjectName} placeholder="project name" required />
                </label>
                <br /><br />
                <label>
                    Description:
                    <input type="text" value={description} onChange={handleSetDescription} placeholder="description" required />
                </label>
                <br /><br />
                <label>
                    Project ID
                    <input type="text" value={projectID} onChange={handleSetProjectId} placeholder="project id" required />
                </label>
                <br /><br />
                <button type="submit">Create Project</button>
            </form> 
            {projectMessage && <p>{projectMessage}</p>}
            <br />
            <h3>Join Project</h3>
            <form onSubmit = {handleJoinProject}>
                <label>
                    Project ID
                    <input
                        type="text"
                        value = {joinProjectID}
                        onChange={handleSetJoinProjectId}
                        placeholder="project id"
                        required
                    />
                </label>
                <br /><br />
                <button type="submit">Join Project</button>
                {joinMessage && <p>{joinMessage}</p>}
            </form>
        </div>
    );
}

export default Projects;