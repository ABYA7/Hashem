import { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, CardContent } from '@mui/material';
import { 
  MenuBook, AutoStories, FormatListNumbered, Translate,
  People, Comment, Image, Map
} from '@mui/icons-material';
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
    <Box sx={{ 
      p: 2, 
      borderRadius: '12px', 
      bgcolor: `${color}22`, // transparent version
      color: color,
      mr: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon fontSize="large" />
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={600} textTransform="uppercase">
        {title}
      </Typography>
      <Typography variant="h4" component="div" fontWeight={700}>
        {value.toLocaleString()}
      </Typography>
    </Box>
  </Paper>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/estadisticas');
        setStats(response.data.resumen);
      } catch (err) {
        setError('Error al cargar estadísticas. Asegúrate de que PostgreSQL y el servidor backend estén corriendo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel de Control
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Resumen general de la base de datos de HASHEM.
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Biblias" value={stats?.biblias || 0} icon={MenuBook} color="#58a6ff" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Libros" value={stats?.libros || 0} icon={AutoStories} color="#2ea043" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Capítulos" value={stats?.capitulos || 0} icon={FormatListNumbered} color="#d29922" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Versículos" value={stats?.versiculos || 0} icon={FormatListNumbered} color="#f85149" />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Diccionario" value={stats?.diccionario || 0} icon={Translate} color="#8957e5" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Usuarios" value={stats?.usuarios || 0} icon={People} color="#3fb950" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Imágenes" value={stats?.imagenes || 0} icon={Image} color="#bc8cff" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Mapas" value={stats?.mapas || 0} icon={Map} color="#d2a8ff" />
        </Grid>
      </Grid>
    </Box>
  );
}
