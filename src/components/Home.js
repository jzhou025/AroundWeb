import React from 'react';
import { Tabs, Spin, Row, Col } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants';
import { MAP_KEY } from '../keys';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;

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
        console.log(position);
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

    loadNearbyPosts = (center, radius) => {
        const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({
            isLoadingPosts: true
        });
        // Firs API call
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load posts.');
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    isLoadingPosts: false,
                    posts: data ? data : []
                });
            })
            .catch((e) => {
                this.setState({
                    isLoadingPosts: false,
                    error: e.message
                })
            });
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter(({ type }) => type === 'image')
            .map(({ user, url, message }) => ({
                user: user,
                src: url,
                thumbnail: url,
                caption: message,
                thumbnailWidth: 400,
                thumbnailHeight: 300,
            }));
        return (<Gallery images={images} />);
    }

    getVideoPosts = () => {
        const videos = this.state.posts
            .filter(({type}) => type === 'video')
            .map(({ user, url, message }) => {
                return (
                    <Col span={6} key={url}>
                        <video src={url} controls className='video-block'/>
                        <p>{`${user}: ${message}`}</p>
                    </Col>                   
                );
            });
        return (<Row gutter={32}>{videos}</Row>);
    }

    getPanelContent = (type) => {
        const { error, isLoadingGeoLocation, isLoadingPosts, posts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip='Loading geo location...' />;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..." />;
        } else if (posts && posts.length > 0) {
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return 'No nearby posts :(';
        }
    }

    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts} />;
        return (
            <Tabs className="main-tabs" tabBarExtraContent={operations}>
                <TabPane tab="Image Posts" key="1">
                    <div>
                        <h1>Hello</h1>
                        {this.getPanelContent('image')}
                    </div>
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.getPanelContent('video')}
                </TabPane>
                <TabPane tab="Map" key="3">
                    <AroundMap
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        loadNearbyPosts={this.loadNearbyPosts}
                    />
                </TabPane>
            </Tabs>
        );
    }
}