import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Grid, Alert, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [bio, setBio] = useState('');
    const [description, setDescription] = useState('');
    const [videos, setVideos] = useState([]);
    const [videoDetails, setVideoDetails] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(res.data);
        };

        fetchUserData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/users/update', {
                bio,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuccess('Details updated successfully!');
            setUserData(res.data);
        } catch (err) {
            setError('Failed to update details. Please try again.');
        }
    };

    const handleVideoChange = (e) => {
        setVideos(e.target.files);
        const details = Array.from(e.target.files).map(file => ({
            title: '',
            description: '',
            file
        }));
        setVideoDetails(details);
    };

    const handleVideoDetailsChange = (index, field, value) => {
        const updatedDetails = [...videoDetails];
        updatedDetails[index][field] = value;
        setVideoDetails(updatedDetails);
    };

    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        const formData = new FormData();
        videoDetails.forEach((detail, index) => {
            formData.append('videos', detail.file);
            formData.append(`titles[${index}]`, detail.title);
            formData.append(`descriptions[${index}]`, detail.description);
        });
    
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/users/upload-video', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            setSuccess('Videos uploaded successfully!');
            navigate('/videos');
            setUserData(res.data);
        } catch (err) {
            console.error('Error uploading video:', err.response ? err.response.data : err);
            setError('Failed to upload videos. Please try again.');
        }
    };

    const handleVideoRemove = (index) => {
        const updatedVideos = Array.from(videos);
        updatedVideos.splice(index, 1);
        setVideos(updatedVideos);

        const updatedDetails = [...videoDetails];
        updatedDetails.splice(index, 1);
        setVideoDetails(updatedDetails);
    };
    
    if (!userData) return <div>Loading...</div>;

    return (
        <Container style={{ backgroundImage: 'url(https://via.placeholder.com/1500)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">User Details</Typography>
                            <Typography variant="body1">First Name: {userData.firstName}</Typography>
                            <Typography variant="body1">Last Name: {userData.lastName}</Typography>
                            <Typography variant="body1">Email: {userData.email}</Typography>
                            <Typography variant="body1">Phone Number: {userData.number}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box mb={4}>
                    <Typography variant="h6" gutterBottom>
                        Update Bio and Description
                    </Typography>
                    <form onSubmit={handleUpdate}>
                        <TextField
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Update
                        </Button>
                    </form>
                </Box>
            </Paper>
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Upload Videos
                </Typography>
                <form onSubmit={handleVideoUpload}>
                    <input
                        type="file"
                        accept="video/mp4"
                        multiple
                        onChange={handleVideoChange}
                        style={{ display: 'none' }}
                        id="video-upload"
                    />
                    <label htmlFor="video-upload">
                        <Button variant="contained" component="span" color="primary">
                            Choose Videos
                        </Button>
                    </label>
                    <List>
                        {videoDetails.map((video, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={video.file.name} secondary={`Title: ${video.title} | Description: ${video.description}`} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleVideoRemove(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    {videoDetails.length > 0 && videoDetails.map((video, index) => (
                        <Box key={index} mt={2}>
                            <TextField
                                label="Title"
                                value={video.title}
                                onChange={(e) => handleVideoDetailsChange(index, 'title', e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                value={video.description}
                                onChange={(e) => handleVideoDetailsChange(index, 'description', e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                    ))}
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                        Upload
                    </Button>
                </form>
            </Paper>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </Container>
    );
};

export default Dashboard;
