import axios from 'axios'

export async function likePost({ id }) {
	return await axios.put(`https://route-posts.routemisr.com/posts/${id}/like`, {}, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('userToken')}`
		}
	})
}



