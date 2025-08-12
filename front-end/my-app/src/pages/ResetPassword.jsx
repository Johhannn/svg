import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { requestPasswordReset, verifyPasswordResetOTP } from '../api/auth';

const steps = ['Enter Email', 'Verify OTP', 'New Password'];

const ResetPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      if (activeStep === 0) {
        await requestPasswordReset(email);
        setActiveStep(1);
      } else if (activeStep === 1) {
        setActiveStep(2);
      } else if (activeStep === 2) {
        await verifyPasswordResetOTP(email, otp, newPassword);
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3, mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ width: '100%', mt: 2 }}>
          {activeStep === 0 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          {activeStep === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="OTP Code"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}
          {activeStep === 2 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="New Password"
              type="password"
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} variant="contained">
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;