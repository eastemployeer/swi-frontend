import { Theme } from '@mui/material/styles';

export const summaryBoxMixin = (theme: Theme) => ({
  backgroundColor: theme.palette.grey['300'],
  padding: '20px',
  marginTop: '20px',
  fontSize: theme.typography.body1.fontSize,
});
