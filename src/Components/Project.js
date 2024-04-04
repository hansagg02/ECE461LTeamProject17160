
    
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Logout from './Logout';

function Projects() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', id: '', valid: false });
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projectjoinId, setProjectjoinId] = useState('');
    const [projectMessage, setProjectMessage] = useState('');
    const [joinMessage, setJoinMessage] = useState('');
    const [joinProjectId, setJoinProjectId] = useState('');
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

    // useEffect(() => {
    //     if (location.state) {
    //         const { username, id, valid } = location.state;
    //         if (valid) {
    //             setUser({ username, id, valid });
    //         } else {
    //             navigate("/signin");
    //         }
    //     }
    //     fetchUserProjects();
    // }, [location, navigate]);


    const handleCreateProject = async (event) => {
        event.preventDefault();
        // setProjectMessage("Project created successfully!");
        // navigate('/hardware', { state: { projectName: projectName } });
        const userID = localStorage.getItem('userID');
        const data = { projectName, description, projectId, userID};
        fetch('http://localhost:5000/create_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                setProjectMessage("Project created successfully!");
                navigate('/hardware', { state: { projectName: projectName } });
            } else {
                setProjectMessage("Response code: " + data.code + " Response message: " + data.error);
            }
        })
        .catch(error => {
            setProjectMessage("Error creating project: " + error.message);
        });
        
    };

    const handleJoinProject = async (event) => {
        event.preventDefault();
        // const data = { 'projectId': joinProjectId, 'userId': localStorage.getItem("userId") };
        // const response = await fetch('/join_project', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // });
        // const responseData = await response.json();
    
        // if (response.ok) {  
        //     setJoinMessage("Project joined successfully!");
    
        //     // Fetch project details after successfully joining the project
        //     const projectResponse = await fetch(`/get_user_projects`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ 'userId': localStorage.getItem("userId") }),
        //     });
        //     const projectData = await projectResponse.json();
    
        //     // Find the joined project in the user's projects list
        //     const joinedProject = projectData.find(project => project.projectId === joinProjectId);
        //     if (joinedProject) {
        //         // Set projectName based on the fetched project details
        //         setProjectName(joinedProject.projectName);
    
        //         // Navigate to the resources page with the updated projectName state
        //         navigate('/resources', { state: { projectName: joinedProject.projectName } });
        //     } else {
        //         // Handle error if the joined project is not found
        //         setJoinMessage("Error: Joined project details not found");
        //     }
        // } else {
        //     // Handle error if joining project fails
        //     setJoinMessage("Error joining project: " + responseData.error);
        // }
    };


    // const handleProjectClick = (projectName) => {
    //     navigate('/hardware', { state: { projectName: projectName } });
    // };
   
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
                    <input type="text" value={projectId} onChange={handleSetProjectId} placeholder="project id" required />
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
                        value = {joinProjectId}
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

const Project = () => {
    return (
      <>
          <Projects username="User" message="ok" />
      </>
    );
  };

export default Projects;