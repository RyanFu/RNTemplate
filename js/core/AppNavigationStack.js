/**
 * Created by evilcode on 2017/12/5.
 */
import React from 'react'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import Routes from './Routes'
import NavigatorUtils from './NavigationUtils'

import { GlobalInit, GlobalInitLogSystem } from './common'
GlobalInit()
GlobalInitLogSystem(false)      // true强制显示日志，false关闭

import Config from './config/Config'
import storage from '../core/data/Storage'
import * as CoreConstants from './config/CoreConstant'
import * as Constants from '../config/Constants'
import request from './network/Request'
import auth from './Auth'
import CToast from "./Toast"
import SplashScreen from 'react-native-splash-screen'

global.storage = storage
global.constant = {
    ...CoreConstants,
    ...Constants
}
global.config = Config
global.auth = auth
global.toast = CToast


// import { EStyleSheet, getRemByDimensions } from './common';
// EStyleSheet.build({
//     rem: getRemByDimensions(),
// })

class AppWithNavigationState extends React.Component {

    constructor(props) {
        super(props)



        request.setDefaultOptions({
            host: config.apiHost,
            beforeSend: (options) => {
                return auth.getTokens()
                    .then(res => {
                        options.headers.append('Authorization', `Bearer ${res.access_token}`)
                    })
                    .catch(() => {})
            },
            unauth: (options) => {
                return auth.logout().then(() => {
                    toast.showCenterLong('你的登录已过期，请重新登录')
                    NavigatorUtils.reset("Login")
                })
            }
        })
    }

    closeSplash = () => {
        SplashScreen.hide()

        // Check hot update.
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.closeSplash()
    }

    render() {
        const { dispatch, nav } = this.props
        const navigation = addNavigationHelpers({
            dispatch,
            state: nav
        })

        return (
            <Routes
                navigation={navigation}
                ref = {
                    (e) => NavigatorUtils.setContainer(navigation)
                }
            />
        )
    }
}

const mapStateToProps = state => ({nav: state.nav})
let AppNavigationStack = connect(mapStateToProps)(AppWithNavigationState)

export default AppNavigationStack