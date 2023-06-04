import { Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import React from "react";
import './ResultItem.scss';

interface ArticleProps {
  title: string;
  url: string;
}

interface ResultItemProps {
  title: string;
  description: string;
  articles?: ArticleProps[];
  snippets?: Record<string, string>;
  img: string;
}

export default function ResultItem({ title, description, articles, snippets, img }: ResultItemProps) {
  let connectedArticles;
  if(articles) {
    connectedArticles = (
      <div className="articlesContainer">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Powiązane artykuły</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {articles.map((article, idx) => (
              <div className="col" key={idx}>
                <Typography>
                  {title}
                </Typography>
                <a target="_blank" rel="noopener noreferrer" href={article.url}>
                  <IconButton type="button" sx={{ p: '10px' }}>
                    <LaunchIcon />
                  </IconButton>
                </a>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </div>
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
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" className="description">{description}</Typography>
          {snippets && Object.keys(snippets).map((key, idx) => <Typography key={idx} variant="caption">{key}: {snippets[key]}</Typography>)}
        </div>
        <div>
          <img src={img} />
        </div>
      </div>
      {connectedArticles}
    </div>
  );
}
