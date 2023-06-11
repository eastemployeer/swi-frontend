/* eslint-disable @typescript-eslint/naming-convention */
import { Divider, Typography } from "@mui/material";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import wtf from 'wtf_wikipedia';
import wtfPluginHtml from 'wtf-plugin-html';
import wtfPluginImage from 'wtf-plugin-image';
import axios from 'axios';
import { useParams } from "react-router";
import './ArticlePage.scss';
import { NavLink } from "react-router-dom";

wtf.extend(wtfPluginHtml);

interface Article {
  RevisionId: number;
  Title: string;
  RevisionText: string;
  img: string;
}

const parser = new DOMParser();

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [content, infobox] = useMemo(() => {
    let htmlString = (wtf(article?.RevisionText || '') as any).html();
    htmlString = htmlString.replaceAll(/href="\.\//g, 'href="/search?0%5Bfield%5D=Title&0%5Btext%5D=');
    htmlString = htmlString.replaceAll('Plik%3A', '');
    const doc = parser.parseFromString(htmlString, 'text/html');

    //PROCCESS INFOBOX
    const box = doc.querySelector('.infobox');
    if(box) box.remove();

    return [doc.documentElement.innerHTML, box?.outerHTML];
  }, [article]);

  const img = useMemo(() => {
    let img;
    const infoboxImg = wtf(article?.RevisionText || '').infobox()?.image()?.url().replaceAll('Plik%3A', '');
    const generalImg = wtf(article?.RevisionText || '').image()?.url().replaceAll('Plik%3A', '');
    if(infoboxImg) img = infoboxImg + '?width=300';
    else if(generalImg) img = generalImg + '?width=300';
    else img = "/sosna.jpg";

    return img;
  }, [article]);

  const fetch = useCallback(async () => {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/results`,
      params: {
        RevisionId: id,
      },
    });

    setArticle(response.data[0]);
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="ArticlePage">
      <div className="mainWrapper">
        <div className='logoWrapper'>
          <NavLink to="/">
            <img src="/logo1.png" alt="Elastic Logo" className="logo" />
          </NavLink>
        </div>
        <div className="content">
          <Typography variant="h5">{article?.Title}</Typography>
          <Divider sx={{  mt: 0.5, mb: 2 }} orientation="horizontal" />
          <div className="row">
            <div className="col">
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
            <div className="col">
              <div className="box">
                <div className="boxText">
                  {article?.Title}
                </div>
                <div className="imgWrapper">
                  <img src={img || "/sosna.jpg"} />
                  <div dangerouslySetInnerHTML={{ __html: infobox || "" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
