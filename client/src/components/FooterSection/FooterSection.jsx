import React from 'react'
import { Layout } from 'antd'
import { LinkedinFilled, GithubFilled, InstagramFilled, LinkOutlined } from '@ant-design/icons'

import './FooterSection.scss'

const FooterSection = () => {
  const { Footer } = Layout

  return (
    <Footer className="layout-home__footer footer-section">
      &#169; 2022 - JUAN G.P.
      <div className='footer-section__social'>
        <a href='https://github.com/garciapereirajuan/to-do-list-mongoose' title='Repositorio de esta App' target='_blank' rel='noreferrer'>
          <GithubFilled style={{ fontSize: '25px' }} />
        </a>
        <a href='https://www.linkedin.com/in/juan-garcia-pereira' title='Mi perfil en Linkedin' target='_blank' rel='noreferrer'>
          <LinkedinFilled style={{ fontSize: '25px' }} />
        </a>
        <a href='https://www.instagram.com/juanmgarciapereira' title='Instagram' target='_blank' rel='noreferrer'>
          <InstagramFilled style={{ fontSize: '25px' }} />
        </a>
        <a href='https://juangarciapereira.web.app/projects' title='Web personal' target='_blank' rel='noreferrer'>
          <LinkOutlined style={{ fontSize: '25px' }} />
        </a>
      </div>
    </Footer >
  )
}

export default FooterSection
