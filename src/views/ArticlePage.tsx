/* eslint-disable @typescript-eslint/naming-convention */
import { Divider, Typography } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useParams } from "react-router";
import './ArticlePage.scss';
import { NavLink } from "react-router-dom";

interface Article {
  RevisionId: number;
  Title: string;
  RevisionText: string;
  img: string;
}

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const { id } = useParams();
  console.log(id);

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
              <div dangerouslySetInnerHTML={{ __html: article?.RevisionText || '' }}></div>
            </div>
            <div className="col">
              <div className="box">
                <div className="boxText">
                  {article?.Title}
                </div>
                <div className="imgWrapper">
                  <img src="/sosna.jpg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
