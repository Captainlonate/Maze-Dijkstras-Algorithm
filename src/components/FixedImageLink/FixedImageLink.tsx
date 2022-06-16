import './fixedImageLink.css'
import GithubLink from '../../images/Octocat.png'
import React from 'react'

export const FixedImageLink: React.FC<{url?:string}> = ({ url }) => (
  <div className='fixed-imagelink'>
    <a href={url} target='_blank' rel='noreferrer'>
      <img src={GithubLink} alt='Link to github' />
    </a>
  </div>
)