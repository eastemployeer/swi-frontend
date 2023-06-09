import React, { useCallback, useState } from 'react';
import { TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { qsStringify } from '../helpers/utils';
import './HomePage.scss';

export default function HomePage() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const onInput = useCallback((event: any) => {
    setTerm(event.target.value);
  }, []);

  const onSearch = useCallback(() => {
    if(term) navigate(`/search${qsStringify({
      0: {
        text: term,
        field: 'RevisionText',
      },
      toArticleLength: 500000,
      fromArticleLength: 1,
      dateFrom: '1970-01-01',
      dateTo: '2023-06-16',
      sortBy: 'rank',
      page: 1,
      limit: 10,
    })}`);
  }, [navigate, term]);
  
  return (
    <div className="HomePage">
      <img src="/logo.png" alt="Elastic Logo" className="logo" />
    
      <div className="search-container">
        <TextField value={term}
                   onInput={onInput}
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                   }}
                   variant="outlined"
                   placeholder="Search Elastic"
                   className="search-input" />
        <Button variant="contained" color="secondary" disableRipple onClick={onSearch}>
          Search in Elastic
        </Button>
      </div>
    </div>
  );
}
