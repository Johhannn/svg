import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { getPages, createPage, updatePage, deletePage } from '../api/pages';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    title: '',
    content: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await getPages();
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const handleOpen = (page = null) => {
    if (page) {
      setCurrentPage({
        id: page.id,
        title: page.title,
        content: page.content,
      });
      setEditMode(true);
    } else {
      setCurrentPage({
        title: '',
        content: '',
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updatePage(currentPage.id, currentPage);
      } else {
        await createPage(currentPage);
      }
      fetchPages();
      handleClose();
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePage(id);
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleViewPage = (id) => {
    navigate(`/pages/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Pages</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Page
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {pages.map((page) => (
          <Card key={page.id} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {page.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {page.content.substring(0, 100)}...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton onClick={() => handleOpen(page)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(page.id)}>
                  <Delete />
                </IconButton>
                <Button
                  size="small"
                  onClick={() => handleViewPage(page.id)}
                  sx={{ ml: 1 }}
                >
                  View
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? 'Edit Page' : 'Add Page'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={currentPage.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Content"
              name="content"
              value={currentPage.content}
              onChange={handleChange}
              required
              multiline
              rows={10}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pages;