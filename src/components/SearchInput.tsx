import React, { useCallback } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Field, Operator, SearchTermProps } from '../views/SerpPage';
import './SearchInput.scss';

interface SearchInputProps {
  value: SearchTermProps;
  onChange: (value: SearchTermProps, index: number) => void;
  onClear: (index: number) => void;
  onSearch: () => void;
  onAdd: () => void;
  index: number;
  numberOfSearchInputs: number;
}

export default function SearchInput({ value, onChange, onAdd, onClear, onSearch, index, numberOfSearchInputs }: SearchInputProps) {
  const onChangeValue = useCallback((event: any) => {
    const newValue = ({ ...value, [event.target.name]: event.target.value });
    onChange(newValue as SearchTermProps, index);
  }, [value, onChange, index]);

  const onDelete = useCallback(() => onClear(index), [index, onClear]);

  let searchIconBtn, plusIconBtn, clearIconBtn, operatorSelect;
  if(index === 0) {
    searchIconBtn = (
      <>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={onSearch}>
          <SearchIcon color="primary" />
        </IconButton>
      </>
    );
  } else {
    operatorSelect = (
      <>
        <Select disableUnderline variant='standard' onChange={onChangeValue} name='operator'>
          {Object.keys(Operator).map(key => <MenuItem key={key} value={Operator[key as keyof typeof Operator]}>{key}</MenuItem>)}
        </Select>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </>
    );
  }

  if(numberOfSearchInputs === index + 1) {
    plusIconBtn = (
      <>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="add" onClick={onAdd}>
          <AddIcon color='primary' />
        </IconButton>
      </>
    );
  }

  if(value.text) {
    clearIconBtn = (
      <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={onDelete}>
        <ClearIcon />
      </IconButton>
    );
  }

  console.log("VAL: ", value.text);
  return (
    <Paper
      className='SearchInput'
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
      {operatorSelect}
      <Select disableUnderline variant='standard' onChange={onChangeValue} name="field" defaultValue={Field.TEXT}>
        {Object.keys(Field).map(key => <MenuItem key={key} value={Field[key as keyof typeof Field]}>{key}</MenuItem>)}
      </Select>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase name='text'
                 value={value.text}
                 onInput={onChangeValue}
                 sx={{ ml: 1, flex: 1 }}
                 placeholder={index === 0 ? "Search Elastic" : "Add search term"} />
      {clearIconBtn}
      {plusIconBtn}
      {searchIconBtn}
    </Paper>
  );
}
