import { Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import React, { useMemo } from "react";
import wtf from 'wtf_wikipedia';
import './ResultItem.scss';
import { NavLink } from "react-router-dom";

interface ArticleProps {
  title: string;
  url: string;
}

interface ResultItemProps {
  id: number;
  title: string;
  description: string;
  snippets?: Record<string, string>;
}

interface WikiLink {
  data: {
    type: string;
    site: string;
    text: string;
  };
}

export default function ResultItem({ title, description, snippets, id }: ResultItemProps) {
  const img = useMemo(() => {
    let img;
    const infoboxImg = wtf(description || '').infobox()?.image()?.url().replaceAll('Plik%3A', '');
    const generalImg = wtf(description || '').image()?.url().replaceAll('Plik%3A', '');
    if(infoboxImg) img = infoboxImg + '?width=100&height=100';
    else if(generalImg) img = generalImg + '?width=100&height=100';
    else img = null;

    return img;
  }, [description]);
  const parsedDescription = useMemo(() => wtf(description).text(), [description]);
  const connectedArticles = useMemo<WikiLink[] | undefined>(() => wtf(description).section('Linki zewnętrzne')?.links() as WikiLink[] | undefined, [description]);
  console.log(connectedArticles);
  let content;
  if(connectedArticles?.length) {
    content = (
      <div className="articlesContainer">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="connectedArticlesHeader">Powiązane artykuły</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {[...new Set(connectedArticles)].filter(article => article.data.type === 'external').map((article, idx) => (
              <>
                <div className="connectedArticleItem" key={idx}>
                  <Typography>
                    {article.data.text}
                  </Typography>
                  <a target="_blank" rel="noopener noreferrer" href={article.data.site}>
                    <IconButton type="button" sx={{ p: '10px' }}>
                      <LaunchIcon />
                    </IconButton>
                  </a>
                </div>
                <Divider sx={{ m: 1 }} orientation="horizontal" />
              </>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="ResultItem">
      <div className="row">
        <div>
          <Typography sx={{ textDecoration: 'none' }} variant="subtitle2" component={NavLink} to={`/article/${id}`}>{title}</Typography>
          <Typography variant="caption" className="description">{parsedDescription}</Typography>
          {snippets && Object.keys(snippets).map((key, idx) => <Typography key={idx} variant="caption">{key}: {snippets[key]}</Typography>)}
        </div>
        <div>
          {img && <img src={img} />}
        </div>
      </div>
      {content}
    </div>
  );
}
