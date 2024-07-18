import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button, Grid, Card, CardMedia, CardContent, Paper } from '@mui/material';

const UserVideos = () => {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://addictivebackend.vercel.app/api/users/users-with-videos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(res.data);
        };

        fetchUsers();
    }, []);

    const handleViewAll = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    return (
        <Container style={{ backgroundImage: 'url(https://via.placeholder.com/1500)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#fff', textAlign: 'center', marginBottom: '30px' }}>
                User Videos
            </Typography>
            {users.map((user) => (
                <Paper key={user._id} elevation={3} style={{ padding: '20px', marginBottom: '30px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <Box mb={4}>
                        <Typography variant="h6" style={{ color: '#333', textAlign: 'center' }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Grid container spacing={2}>
                            {(expandedUserId === user._id ? user.videos : user.videos.slice(0, 5)).map((video, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardMedia
                                            component="video"
                                            controls
                                            src={`https://addictivebackend.vercel.app/${video.videoUrl}`}
                                            title={video.title}
                                        />
                                        <CardContent>
                                            <Typography variant="subtitle1">{video.title}</Typography>
                                            <Typography variant="body2">{video.description}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        {user.videos.length > 5 && (
                            <Box mt={2} textAlign="center">
                                <Button variant="contained" color="primary" onClick={() => handleViewAll(user._id)}>
                                    {expandedUserId === user._id ? 'Show Less' : 'View All'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Paper>
            ))}
        </Container>
    );
};

export default UserVideos;
