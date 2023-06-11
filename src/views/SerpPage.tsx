/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextField, Button, Slider, Typography, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import { NavLink, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import wtf from 'wtf_wikipedia';
import wtfPluginHtml from 'wtf-plugin-html';
import SearchInput from '../components/SearchInput';
import './SerpPage.scss';
import ResultItem from '../components/ResultItem';
import { qsParse, qsStringify } from '../helpers/utils';
import useQsParse from '../hooks/useQsParse';

wtf.extend(wtfPluginHtml);


export enum Operator {
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
  operator?: Operator;
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
  const params = useQsParse<{field: string; text: string; operator?: string}>();
  const paramsRef = useRef(params);
  const [searchTerms, setSearchTerms] = useState<SearchTermProps[]>([{ text: '', field: Field.TITLE }]);
  const [filters, setFilters] = useState({ articleLength: [0, 250], resultsMaxAmount: 20, modificationDate: [new Date(new Date().setDate(1)).getTime(), Date.now()], sorting: "modificationDate" });
  const [results, setResults] = useState<WikiResult[]>([]);
  const [infoBoxHtml, infoBoxData] = useMemo(() => {
    const docWithInfobox = results.find(result => wtf(result.RevisionText).infobox());
    const infoBoxWikiText = wtf(docWithInfobox?.RevisionText || '').infobox()?.wikitext();

    let content = '';
    if(infoBoxWikiText) content = (wtf(infoBoxWikiText) as any).html();

    return [content, wtf(docWithInfobox?.RevisionText || '').infobox()];
  }, [results]);


  // const [infoBoxData, setInfoBoxData] = useState<string | null>(null);
  // const infoBoxSearchTerm = useMemo(() => {
  //   if(!paramsRef.current) return '';

  //   if(paramsRef.current.text) {
  //     return paramsRef.current.text;
  //   } else {
  //     return (Object.values(paramsRef.current) as unknown as SearchTermProps[]).reduce((acc, curr) => acc + ' ' + curr.text, '');
  //   }
  // }, []);

  // const fetchInfoBoxData = useCallback(async () => {
  //   console.log(infoBoxSearchTerm);
  //   const results = await wtf.fetch(infoBoxSearchTerm);
  //   console.log(results);
  //   if(!results) return;

  //   const content = 'hyhy';
  //   // if(Array.isArray(results)) content = (results[0].infobox() as any).html();
  //   // else content = (results.infobox() as any).html();

  //   setInfoBoxData(content);
  // }, [infoBoxSearchTerm]);

  const fetch = useCallback(async () => {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/results`,
    });

    setResults(response.data);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if(paramsRef.current) {
      if(paramsRef.current.text) {
        setSearchTerms([paramsRef.current as any]);
      } else {
        const newValues = Object.values(paramsRef.current) as unknown as SearchTermProps[];
        setSearchTerms(newValues);
      }
    }
  }, []);

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
      window.location.search = qsStringify(searchTerms);
    }
  }, [searchTerms]);

  const onAdd = useCallback(() => {
    setSearchTerms((prev) => [...prev, { text: '', field: Field.TITLE, operator: Operator.AND }]);
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
          <div className="box">
            <div className="imgWrapper">
              <img src={infoBoxData?.image()?.url() || "/sosna.jpg"} />
              <Divider sx={{  mt: 1.5, mb: 2, height: 2 }} orientation="horizontal" />
              <div dangerouslySetInnerHTML={{ __html: infoBoxHtml || "" }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
