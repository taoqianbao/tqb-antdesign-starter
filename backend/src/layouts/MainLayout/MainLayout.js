import React, {
    Component,
    PropTypes
} from 'react';
import {
    Link
} from 'react-router';
import styles from './MainLayout.less';
import LOGO from '../../img/LOGO.png';
import sep from 'img/sep.png'
import head from '../../img/head.png';
import {
    replace
} from 'react-router-redux'
import {
    connect
} from 'react-redux'

import CLTopMenus from 'components/CLTopMenus'

import {
    Menu,
    Breadcrumb,
    Icon,
    Popconfirm,
    Row,
    Col
} from 'antd';
const SubMenu = Menu.SubMenu;

@connect()
class MainLayout extends Component {

    constructor() {
        super();

        var menusJson = sessionStorage.getItem('menus');
        this.topmenus = JSON.parse(menusJson);

        var name = sessionStorage.getItem('name');
        const clientHeight = document.body.clientHeight;
        const height = document.body.clientHeight - 64;
        const contentHeight = height - 64;
        global.contentHeight = contentHeight;
        this.state = {
            menus: [],
            name: name,
            clientHeight: clientHeight,
            containerHeight: height,
            contentHeight: contentHeight,
        };
    }

    componentDidMount() {
        this.chooseTopMenu(this.topmenus[0].id);
    }

    chooseTopMenu = (id) => {
        var menus = [];
        this.topmenus.map((item) => {
            if (item.id == id) {
                menus = item.subs;
            }
        })
        this.setState({
            menus: menus
        });
    }

    confirm = () => {
        sessionStorage.setItem('login', 'false');
        const {
            dispatch
        } = this.props;
        dispatch(replace("/user/login"));
    }

    renderHeader = () => {
        return <div className={styles.header}>
                    <div className={styles.headerleft} >
                        <div className={styles.logo} onClick={() => this.chooseTopMenu(1)} >
                            <div className={styles.logoItem}>
                                <img src={LOGO} className={styles.img}/>
                            </div>
                            <div>
                                <div className={styles.logoText}>后台管理</div>
                            </div>
                        </div>
                        <CLTopMenus
                            menus = {this.topmenus}
                            onClickMenu = {(id) =>  this.chooseTopMenu(id)}
                        />
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.headItem}>
                            <img src={head} className={styles.headItemImg}/>
                        </div>
                        <div className={styles.headItem}>
                            {this.state.name}
                        </div>
                        <div className={styles.headItem}>
                            <Popconfirm placement="bottomRight" title="确认注销？" onConfirm={this.confirm}>
                                <a href="#" style={{color: "black"}}>
                                    <Icon type="poweroff"/>
                                </a>
                            </Popconfirm>
                        </div>
                    </div>
            </div>
    }

    render() {
        var menus = this.state.menus;
        var menu = menus.map(function(menu) {
            var submenus = [];
            var subs = menu.subs;
            for (var i = 0; i < subs.length; i++) {
                var sub = subs[i];
                submenus.push(
                    <Menu.Item key={sub.key}>
                        <Link to={sub.to}>{sub.title}</Link>
                    </Menu.Item>
                );
            }

            return (
                <SubMenu key={menu.key} title={<span className={styles.rootMenuTitle}>{menu.title} </span>}>
                    {submenus}
                </SubMenu>
            );
        });

        return (
            <div className={styles.aside}>
                {this.renderHeader()}
                <Row style={{height:this.state.clientHeight-64}}>
                    <Col span={4} style={{height:this.state.clientHeight-64,overflowY:"auto"}}>
                        <div className={styles.sider}>
                            <Menu mode="inline" 
                                  defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{fontSize: 15}}>
                                {menu}
                            </Menu>
                        </div>
                    </Col>
                    <Col span={20}>
                        <div>
                            <div>
                                <div>
                                    <div style={{height: this.state.contentHeight,overflow:"auto"}}>
                                        {this.props.children || '首页'}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.footer}>
                                版权所有 © 2016 由成倆工作室提供技术支持
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
};

export default MainLayout;