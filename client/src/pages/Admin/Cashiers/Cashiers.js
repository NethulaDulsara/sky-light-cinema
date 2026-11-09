import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAddOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import { getUsers, deleteUser, createStaff } from '../../../store/actions';

const styles = theme => ({
  root: { padding: theme.spacing(4), color: '#fff', minHeight: '100vh' },
  title: { fontWeight: 800 },
  sub: { color: '#94a3b8', marginBottom: theme.spacing(4) },
  layout: {
    display: 'grid',
    gridTemplateColumns: '360px minmax(0, 1fr)',
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' }
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: theme.spacing(3),
    alignSelf: 'start'
  },
  cardTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': { color: '#fff' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.18)' },
    '& .MuiInputLabel-root': { color: '#94a3b8' }
  },
  submit: {
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    color: '#fff',
    fontWeight: 700,
    textTransform: 'none',
    width: '100%',
    padding: theme.spacing(1.2, 0)
  },
  cell: { color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.08)' },
  headCell: { color: '#fff', fontWeight: 700, borderColor: 'rgba(255,255,255,0.08)' },
  roleChip: { background: 'rgba(0,198,255,0.15)', color: '#7bd4ff', fontWeight: 700, textTransform: 'capitalize' },
  empty: { color: '#94a3b8', textAlign: 'center', padding: theme.spacing(6) },
  hint: { color: '#64748b', fontSize: 12, marginTop: -8, marginBottom: theme.spacing(2) }
});

const EMPTY = { name: '', username: '', email: '', phone: '', password: '' };

class Cashiers extends Component {
  state = { form: { ...EMPTY }, submitting: false };

  componentDidMount() {
    this.props.getUsers();
  }

  handleField = e => {
    const { name, value } = e.target;
    this.setState(prev => ({ form: { ...prev.form, [name]: value } }));
  };

  handleCreate = async () => {
    const { form } = this.state;
    if (!form.name || !form.username || !form.email || !form.phone || !form.password) return;
    this.setState({ submitting: true });
    const res = await this.props.createStaff({ ...form, role: 'cashier' });
    this.setState({ submitting: false });
    if (res && res.status === 'success') {
      this.setState({ form: { ...EMPTY } });
      this.props.getUsers();
    }
  };

  handleDelete = async id => {
    await this.props.deleteUser(id);
  };

  render() {
    const { classes, users } = this.props;
    const { form, submitting } = this.state;
    const staff = (users || []).filter(u => u.role === 'cashier' || u.role === 'admin');

    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Cashiers &amp; Box Office Staff
        </Typography>
        <Typography className={classes.sub}>
          Create accounts for counter staff. They sign in with these credentials and
          are taken straight to the box-office POS to sell walk-in tickets.
        </Typography>

        <div className={classes.layout}>
          <div className={classes.card}>
            <Typography className={classes.cardTitle}>
              <PersonAddIcon /> New cashier
            </Typography>
            <TextField className={classes.field} variant="outlined" size="small" label="Full name" name="name" value={form.name} onChange={this.handleField} />
            <TextField className={classes.field} variant="outlined" size="small" label="Username" name="username" value={form.username} onChange={this.handleField} />
            <TextField className={classes.field} variant="outlined" size="small" label="Email" name="email" type="email" value={form.email} onChange={this.handleField} />
            <TextField className={classes.field} variant="outlined" size="small" label="Phone" name="phone" value={form.phone} onChange={this.handleField} />
            <TextField className={classes.field} variant="outlined" size="small" label="Temporary password" name="password" type="password" value={form.password} onChange={this.handleField} />
            <Typography className={classes.hint}>At least 7 characters, and must not contain the word "password".</Typography>
            <Button className={classes.submit} onClick={this.handleCreate} disabled={submitting}>
              {submitting ? <CircularProgress size={22} style={{ color: '#fff' }} /> : 'Create cashier account'}
            </Button>
          </div>

          <div className={classes.card}>
            <Typography className={classes.cardTitle}>Staff accounts ({staff.length})</Typography>
            {staff.length === 0 ? (
              <div className={classes.empty}>No cashier accounts yet. Create one on the left.</div>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headCell}>Name</TableCell>
                    <TableCell className={classes.headCell}>Username</TableCell>
                    <TableCell className={classes.headCell}>Email</TableCell>
                    <TableCell className={classes.headCell}>Role</TableCell>
                    <TableCell className={classes.headCell} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staff.map(u => (
                    <TableRow key={u._id}>
                      <TableCell className={classes.cell}>{u.name}</TableCell>
                      <TableCell className={classes.cell}>{u.username}</TableCell>
                      <TableCell className={classes.cell}>{u.email}</TableCell>
                      <TableCell className={classes.cell}>
                        <Chip size="small" className={classes.roleChip} label={u.role} />
                      </TableCell>
                      <TableCell className={classes.cell} align="right">
                        <IconButton size="small" style={{ color: '#ef5350' }} onClick={() => this.handleDelete(u._id)} aria-label="Delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ users: state.userState.users });

export default connect(mapStateToProps, { getUsers, deleteUser, createStaff })(
  withStyles(styles)(Cashiers)
);
