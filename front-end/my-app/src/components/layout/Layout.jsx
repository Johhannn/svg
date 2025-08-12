import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wiki App
          </Typography>
          {user && (
            <>
              <Button color="inherit" href="/">
                Dashboard
              </Button>
              <Button color="inherit" href="/pages">
                Pages
              </Button>
              <Button color="inherit" href="/users">
                Users
              </Button>
              <Button color="inherit" href="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;