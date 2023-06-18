/* eslint-disable @typescript-eslint/naming-convention */
import { CircularProgress, Divider, MenuItem, Select, Typography } from "@mui/material";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import wtf from 'wtf_wikipedia';
import wtfPluginHtml from 'wtf-plugin-html';
import wtfPluginImage from 'wtf-plugin-image';
import axios from 'axios';
import { useParams } from "react-router";
import './ArticlePage.scss';
import { NavLink } from "react-router-dom";
import TranslateIcon from '@mui/icons-material/Translate';
import useAsyncCallback from "../hooks/useAsyncCallback";

wtf.extend(wtfPluginHtml);

interface Article {
  revisionId: number;
  title: string;
  revisionText: string;
  img: string;
}

const parser = new DOMParser();

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [language, setLanguage] = useState("pl");
  const [translatedText, setTranslatedText] = useState("");
  const [content, infobox] = useMemo(() => {
    let htmlString = (wtf(article?.revisionText || '') as any).html();
    htmlString = htmlString.replaceAll("_", "%20").replaceAll(/href="\.\//g, 'href="/search?fromArticleLength=0&toArticleLength=500000&page=1&limit=20&sortBy=rank&dateFrom=1970-01-01&dateTo=2023-06-18&0%5Bfield%5D=RevisionText&0%5Btext%5D=');
    htmlString = htmlString.replaceAll('Plik%3A', '');
    const doc = parser.parseFromString(htmlString, 'text/html');

    //PROCCESS INFOBOX
    const box = doc.querySelector('.infobox');
    if(box) box.remove();

    return [doc.documentElement.innerHTML, box?.outerHTML];
  }, [article]);

  const img = useMemo(() => {
    let img;
    const infoboxImg = wtf(article?.revisionText || '').infobox()?.image()?.url().replaceAll('Plik%3A', '');
    const generalImg = wtf(article?.revisionText || '').image()?.url().replaceAll('Plik%3A', '');
    if(infoboxImg) img = infoboxImg + '?width=300';
    else if(generalImg) img = generalImg + '?width=300';

    return img;
  }, [article]);

  const [translate, translating] = useAsyncCallback(async (destLang: string) => {
    return await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/translate`,
      params: {
        pageId: id,
        destLang,
      },
    });
  }, [id]);

  const onLanguageChange = useCallback(async (event: any) => {
    setLanguage(event.target.value);
    const response = await translate(event.target.value);
    try {
      setTranslatedText(JSON.parse(response.data.revisionText).data.translations.translatedText);
    } catch(e) {
      console.log(e);
    }

    console.log(response);
  }, [translate]);

  const [fetch, fetching] = useAsyncCallback(async () => {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/Document`,
      params: {
        pageId: id,
      },
    });

    setArticle(response.data);
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
          <div className="heading">
            <Typography variant="h5">{article?.title}</Typography>
            <div className="languageBox">
              <TranslateIcon />
              <Select name="language" variant='standard' value={language} onChange={onLanguageChange}>
                <MenuItem value="pl">Polski</MenuItem>
                <MenuItem value="en">Angielski</MenuItem>
                <MenuItem value="es">Hiszpański</MenuItem>
                <MenuItem value="fr">Francuski</MenuItem>
                <MenuItem value="de">Niemiecki</MenuItem>
              </Select>
            </div>
          </div>
          <Divider sx={{  mt: 0.5, mb: 2 }} orientation="horizontal" />
          <div className="row">
            <div className="col contentCol">
              {translating && <div className='progress'><CircularProgress size={50} /></div>}
              {!translating && language !== "pl" && <div>{translatedText}</div>}

              {fetching && <div className='progress'><CircularProgress size={50} /></div>}
              {!fetching && language === "pl" && <div dangerouslySetInnerHTML={{ __html: content }}></div>}
            </div>
            <div className="col">
              <div className="box">
                <div className="boxText">
                  {article?.title}
                </div>
                <div className="imgWrapper">
                  {img && <img src={img} />}
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
