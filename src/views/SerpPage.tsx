/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from 'react';
import { TextField, Button, Slider, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { NavLink, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchInput from '../components/SearchInput';
import './SerpPage.scss';
import ResultItem from '../components/ResultItem';
import { qsStringify } from '../helpers/utils';

export enum Operator {
  START = "",
  AND = "and",
  OR = "or"
}

export enum Field {
  TITLE = "Title",
  TEXT = "RevisionText"
}

export interface SearchTermProps {
  text: string;
  field: Field;
  operator: Operator;
}

export interface WikiResult {
  RevisionId: number;
  RevisionText: string;
  RevisionTimestamp: number;
  Title: string;
}

function parseTimestamp(value: number) {
  return new Date(value).toDateString();
}

function parseWords(value: number) {
  return `${value} słów`;
}

export default function SerpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerms, setSearchTerms] = useState<SearchTermProps[]>([{ text: '', field: Field.TITLE, operator: Operator.START }]);
  const [filters, setFilters] = useState({ articleLength: [0, 250], resultsMaxAmount: 20, modificationDate: [new Date(new Date().setDate(1)).getTime(), Date.now()], sorting: "modificationDate" });
  const [results, setResults] = useState<WikiResult[]>([]);

  const fetch = useCallback(async () => {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/results`,
    });

    setResults(response.data);
  }, []);

  useEffect(() => {
    const query = searchParams.get('query');
    fetch();
  }, [fetch, searchParams]);

  const onChange = useCallback((term: SearchTermProps, index: number) => {
    const terms = JSON.parse(JSON.stringify(searchTerms));
    terms[index] = term;
    setSearchTerms(terms);
  }, [searchTerms]);

  const onFiltersChange = useCallback((event: any) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const onClear = useCallback((index: number) => {
    const terms = JSON.parse(JSON.stringify(searchTerms));

    if(index === 0) terms[index].text = '';
    else terms.splice(index, 1);

    setSearchTerms(terms);
  }, [searchTerms]);

  const onSearch = useCallback(() => {
    if(searchTerms.length > 0) {
      setSearchParams(qsStringify(searchTerms));
    }
  }, [searchTerms, setSearchParams]);

  const onAdd = useCallback(() => {
    setSearchTerms((prev) => [...prev, { text: '', field: Field.TITLE, operator: Operator.START }]);
  }, []);

  return (
    <div className="SerpPage">
      <div className='logoWrapper'>
        <NavLink to="/">
          <img src="/logo1.png" alt="Elastic Logo" className="logo" />
        </NavLink>
      </div>
      <div className='content'>
        <div className='col'>
          <div className='searchContainer'>
            {searchTerms.map((term, idx) => <SearchInput key={idx}
                                                         index={idx}
                                                         numberOfSearchInputs={searchTerms.length}
                                                         value={term}
                                                         onSearch={onSearch}
                                                         onAdd={onAdd}
                                                         onChange={onChange}
                                                         onClear={onClear} />)}
          </div>
          <div className='filterContainer'>
            <div className='filter'>
              <Typography variant="caption">Długość artykułu</Typography>
              <Slider name="articleLength"
                      value={filters.articleLength}
                      onChange={onFiltersChange}
                      valueLabelFormat={parseWords}
                      valueLabelDisplay="auto" />
            </div>
            <div className='filter'>
              <Typography variant="caption">Ilość wyników</Typography>
              <Slider name="resultsMaxAmount"
                      className="resultsMaxAmountSlider"
                      value={filters.resultsMaxAmount}
                      onChange={onFiltersChange}
                      max={15000}
                      valueLabelDisplay="auto" />
            </div>
            <div className='filter'>
              <Typography variant="caption">Data modyfikacji</Typography>
              <Slider name="modificationDate"
                      className="dateModifySlider"
                      value={filters.modificationDate}
                      min={1680000167256}
                      max={Date.now()}
                      onChange={onFiltersChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={parseTimestamp} />
            </div>
            <div className='filter'>
              <Typography variant="caption">Sortowanie</Typography>
              <Select name="sorting" variant='standard' value={filters.sorting}>
                <MenuItem value="modificationDate">Data modyfikacji</MenuItem>
              </Select>
            </div>
          </div>
          {results.map((result, idx) => <ResultItem key={idx} id={result.RevisionId} title={result.Title} description={result.RevisionText} img="/sosna.jpg" />)}
        </div>
        <div className='col'>

        </div>
      </div>
    </div>
  );
}
