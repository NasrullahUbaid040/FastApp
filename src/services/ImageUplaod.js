import axios from "axios"

import API_URL from '../config/constants'

const ImageUplaod = {




    UploadmyImage: (uri) => {
        console.log('uri______', uri)
        let data = new FormData();
        data.append('file', {
            uri: uri,
            type: 'image/*',
            name: 'image.jpg',
        });
        return axios.post(`${API_URL}/upload`, data)
    },


    UploadmyVideo: (uri) => {
        console.log("URIIIII", uri)
        let data = new FormData();
        data.append('file', {
            uri: uri,
            type: 'video/quicktime',
            name: 'something.mp4',
        });
        return axios.post(`${API_URL}/upload`, data)
    },






}
export default ImageUplaod;