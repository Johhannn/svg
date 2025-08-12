import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  CircularProgress,
  Link
} from '@mui/material';
import { 
  Article as ArticleIcon, 
  People as PeopleIcon,
  Comment as CommentIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { getPages } from '../api/pages';
import { getUsers } from '../api/users';
import { getComments } from '../api/comments';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    pageCount: 0,
    userCount: 0,
    commentCount: 0,
    recentPages: [],
    recentComments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pagesRes, usersRes, commentsRes] = await Promise.all([
          getPages(),
          getUsers(),
          getComments()
        ]);

        setStats({
          pageCount: pagesRes.data.length,
          userCount: usersRes.data.length,
          commentCount: commentsRes.data.length,
          recentPages: pagesRes.data.slice(0, 3),
          recentComments: commentsRes.data.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArticleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Pages</Typography>
                  <Typography variant="h4">{stats.pageCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Users</Typography>
                  <Typography variant="h4">{stats.userCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CommentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Comments</Typography>
                  <Typography variant="h4">{stats.commentCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Pages */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Pages
            <Link component={RouterLink} to="/pages" sx={{ float: 'right', fontSize: '0.875rem' }}>
              View All
            </Link>
          </Typography>
          {stats.recentPages.length > 0 ? (
            <Grid container spacing={2}>
              {stats.recentPages.map((page) => (
                <Grid item xs={12} sm={6} md={4} key={page.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" component={RouterLink} to={`/pages/${page.id}`}>
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {page.content.substring(0, 100)}...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No pages found
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Comments
            <Link component={RouterLink} to="/comments" sx={{ float: 'right', fontSize: '0.875rem' }}>
              View All
            </Link>
          </Typography>
          {stats.recentComments.length > 0 ? (
            <Box>
              {stats.recentComments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    On page: <Link component={RouterLink} to={`/pages/${comment.page}`}>{comment.page_title}</Link>
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {comment.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <HistoryIcon color="action" sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments found
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;