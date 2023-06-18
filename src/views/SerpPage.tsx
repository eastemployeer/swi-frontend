/* eslint-disable @typescript-eslint/naming-convention */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextField, Button, Slider, Typography, Select, MenuItem, FormControl, InputLabel, Divider, CircularProgress, IconButton } from '@mui/material';
import { NavLink, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import wtf from 'wtf_wikipedia';
import wtfPluginHtml from 'wtf-plugin-html';
import moment from 'moment';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchInput from '../components/SearchInput';
import './SerpPage.scss';
import ResultItem from '../components/ResultItem';
import { qsParse, qsStringify } from '../helpers/utils';
import useQsParse from '../hooks/useQsParse';
import useAsyncCallback from '../hooks/useAsyncCallback';
import useRefCache from '../hooks/useRefCache';

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

export interface SearchParams {
  field: string;
  text: string;
  toArticleLength: string;
  fromArticleLength: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  page: string;
  limit: string;
  operator?: string;
}

export interface WikiResult {
  revisionId: number;
  pageId: number;
  revisionText: string;
  revisionTimestamp: number;
  revisionTextLength: number;
  title: string;
  imageUrls: string[];
}

function parseTimestamp(value: number) {
  return new Date(value).toDateString();
}

function parseWords(value: number) {
  return `${value} słów`;
}

const parser = new DOMParser();

export default function SerpPage() {
  const params = useQsParse<{field: string;
                             text: string;
                             toArticleLength: string;
                             fromArticleLength: string;
                             dateFrom: string;
                             dateTo: string;
                             sortBy: string;
                             page: string;
                             limit: string;
                             operator?: string;}>();
  const paramsRef = useRef(params);
  const [searchTerms, setSearchTerms] = useState<SearchTermProps[]>([{ text: '', field: Field.TITLE }]);
  const [filters, setFilters] = useState({ articleLength: [0, 5000000], resultsMaxAmount: 20, modificationDate: [1, Date.now()], sorting: "rank" });
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<WikiResult[]>([]);
  const [infoBoxHtml, infoBoxImg, infoBoxData] = useMemo(() => {
    const docWithInfobox = results.find(result => wtf(result.revisionText).infobox());
    const infoBoxWikiText = wtf(docWithInfobox?.revisionText || '').infobox()?.wikitext();

    let content = '';
    if(infoBoxWikiText) content = (wtf(infoBoxWikiText) as any).html();


    content = content.replaceAll("_", "%20").replaceAll(/href="\.\//g, 'href="/search?fromArticleLength=0&toArticleLength=500000&page=1&limit=20&sortBy=rank&dateFrom=1970-01-01&dateTo=2023-06-18&0%5Bfield%5D=RevisionText&0%5Btext%5D=');
    const doc = parser.parseFromString(content, 'text/html');
    content = doc.documentElement.outerHTML;

    let img;
    const infoboxImg = wtf(docWithInfobox?.revisionText || '').infobox()?.image()?.url().replaceAll('Plik%3A', '');
    const generalImg = wtf(docWithInfobox?.revisionText || '').image()?.url().replaceAll('Plik%3A', '');
    if(infoboxImg) img = infoboxImg + '?width=300';
    else if(generalImg) img = generalImg + '?width=300';
    else img = null;

    return [content, img, wtf(docWithInfobox?.revisionText || '').infobox()];
  }, [results]);

  const [fetch, fetching] = useAsyncCallback(async () => {
    let response;

    try {
      response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_SERVER_URL}/Search${window.location.search}`,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        },
      });
    } catch(e) {
      console.error(e);
    }

    if(response) {
      setResults(response.data.map((el: any) => {
        return {
          ...el.result.document,
          revisionText: el.result.document.revisionText,
          imageUrls: el.result.imageUrls,
        };
      }));
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if(paramsRef.current) {
      const {      toArticleLength,
                   fromArticleLength,
                   dateFrom,
                   dateTo,
                   sortBy,
                   page: pageTemp,
                   limit, ...rest } = paramsRef.current;
      
      if(paramsRef.current.text) {
        setSearchTerms([...rest as any]);
      } else {
        const newValues = Object.values(rest) as unknown as SearchTermProps[];
        setSearchTerms(newValues);
      }
      setFilters({ articleLength: [Number(fromArticleLength) || 0, Number(toArticleLength) || 50000],
                   resultsMaxAmount: Number(limit) || 10,
                   modificationDate: [Date.parse(dateFrom || '1971-01-01') || 1, Date.parse(dateTo || '2023-06-18')],
                   sorting: sortBy || "rank" });
      setPage(Number(pageTemp) || 1);
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

  const onSearch = useCallback((newPage?: number) => {
    if(searchTerms.length > 0) {
      window.location.search = qsStringify({
        ...searchTerms,
        fromArticleLength: filters.articleLength[0],
        toArticleLength: filters.articleLength[1],
        page: newPage || page,
        limit: filters.resultsMaxAmount,
        sortBy: filters.sorting,
        dateFrom: moment(filters.modificationDate[0]).format('YYYY-MM-DD'),
        dateTo: moment(filters.modificationDate[1]).format('YYYY-MM-DD'),
      });
    }
  }, [searchTerms, filters, page]);

  const onAdd = useCallback(() => {
    setSearchTerms((prev) => [...prev, { text: '', field: Field.TITLE, operator: Operator.AND }]);
  }, []);

  const onNext = useCallback(() => {
    onSearch(page + 1);
  }, [page, onSearch]);
  
  const onPrev = useCallback(() => {
    onSearch(page - 1);
  }, [page, onSearch]);

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
                                                         onSearch={() => onSearch()}
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
                      max={5000000}
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
                      min={0}
                      max={Date.now()}
                      onChange={onFiltersChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={parseTimestamp} />
            </div>
            <div className='filter'>
              <Typography variant="caption">Sortowanie</Typography>
              <Select name="sorting" variant='standard' value={filters.sorting} onChange={onFiltersChange}>
                <MenuItem value="rank">Ranking</MenuItem>
                <MenuItem value="revisionTimestamp">Data modyfikacji</MenuItem>
                <MenuItem value="revisionTextLength">Długość artykułu</MenuItem>
                <MenuItem value="title">Tytuł</MenuItem>
              </Select>
            </div>
          </div>
          {fetching &&
          <div className='progress'>
            <CircularProgress size={50} />
          </div>
          }
          {!fetching && results.map((result, idx) => <ResultItem key={idx} id={result.pageId} title={result.title} description={result.revisionText} />)}
          <Divider sx={{  mt: 1.5, mb: 2, height: 2 }} orientation="horizontal" />
          <div className='pagination'>
            <IconButton disabled={page === 1} onClick={onPrev}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton disabled={results.length < filters.resultsMaxAmount} onClick={onNext}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </div>
        </div>
        {!fetching && infoBoxHtml &&
          <div className='col'>
            <div className="box">
              <div className="imgWrapper">
                {infoBoxImg && <img src={infoBoxImg} />}
                <Divider sx={{  mt: 1.5, mb: 2, height: 2 }} orientation="horizontal" />
                <div dangerouslySetInnerHTML={{ __html: infoBoxHtml || "" }} />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
