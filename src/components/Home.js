import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants';

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        isLoadingPosts: false,
        error: '',
        posts: []
    }
    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({
                isLoadingGeoLocation: true
            });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation, /* success call back */
                this.onFailLoadGeoLocation,  /* fail call back */
                GEO_OPTIONS     /* options config for getCurrentPosition function */
            );
        } else {
            this.setState({
                error: 'Geolocation is not supported.'
            });
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({
            lat: latitude,
            lon: longitude
        }));
        this.setState({
            isLoadingGeoLocation: false
        });
        this.loadNearbyPosts();
    }

    onFailLoadGeoLocation = () => {
        this.setState({
            isLoadingGeoLocation: false,
            error: 'Failed to get geolocation'
        });
    }

    loadNearbyPosts = () => {
       
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);

        this.setState({
            isLoadingPosts: true
        });
        // Firs API call
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Failed to load posts.');
        })
        .then((data) => {
            this.setState ({
                isLoadingPosts: false,
                posts: data ? data : []
            });
        })
        .catch((error) => {
            this.setState({
                isLoadingPosts: false,
                error
            })
        });
    }

    getImagePosts = () => {
        const { error, isLoadingGeoLocation, isLoadingPosts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip='Loading geo location...' />;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..." />;
        } else {
            return 'image posts';   // render image posts
        }
    }

    render() {
        return (
            <Tabs className="main-tabs" tabBarExtraContent={operations}>
                <TabPane tab="Image Posts" key="1">
                    <div>
                        <h1>Hello Julia</h1>
                        {this.getImagePosts()}
                    </div>
                </TabPane>
                <TabPane tab="Video Posts" key="2">Content of tab 2</TabPane>
                <TabPane tab="Map" key="3">Content of tab 3</TabPane>
            </Tabs>
        );
    }
}