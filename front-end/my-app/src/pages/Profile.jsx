import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Avatar,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUser, updateUser } from '../api/users';
import { Lock as LockIcon, Email as EmailIcon, Person as PersonIcon } from '@mui/icons-material';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUser(authUser.user_id);
        setProfile(response.data);
        setFormData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || '',
          username: response.data.username || '',
        });
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser(profile.id, formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No profile data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
              {profile.first_name?.charAt(0) || profile.username.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                @{profile.username}
              </Typography>
            </Box>
          </Box>

          {editMode ? (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <PersonIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled
                    InputProps={{
                      startAdornment: (
                        <PersonIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(false)}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </form>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <EmailIcon color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Email
                </Typography>
                <Typography variant="body1">{profile.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <PersonIcon color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Username
                </Typography>
                <Typography variant="body1">{profile.username}</Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              <LockIcon color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Security
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              href="/reset-password"
            >
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;