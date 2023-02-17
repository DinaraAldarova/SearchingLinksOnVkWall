import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import bridge from "@vkontakte/vk-bridge";
import {
	Panel,
	PanelHeader,
	PanelHeaderBack,
	Header,
	Button,
	Group,
	Cell,
	Div,
	Avatar,
} from "@vkontakte/vkui";

const Reposts = ({ id, apiToken, go }) => {
	const MAXPOSTLENGTH = 300;
	const [posts, setPosts] = useState([]);
	const [profiles, setProfiles] = useState([]);
	const [repostsFrom, setRepostsFrom] = useState([]);
	const [showRepostsFrom, setShowRepostsFrom] = useState(null);

	useEffect(() => {
		//загрузка
		async function loadWall() {
			const callAPIMethodResult = await bridge.send("VKWebAppCallAPIMethod", {
				method: "wall.get",
				params: {
					access_token: apiToken,
					count: 100,
					extended: 1,
					v: "5.131"
				}
			});
			console.log("callAPIMethodResult", callAPIMethodResult);
			setPosts(callAPIMethodResult.response.items);
			let replyes = [];
			callAPIMethodResult.response.items.forEach(item =>
				item.copy_history ? item.copy_history.forEach(copy =>
					replyes.includes(copy.from_id) ? null : replyes.push(copy.from_id)) : null);
			console.log("replyes", replyes);
			let profiles = callAPIMethodResult.response.groups;
			profiles.forEach(profile => profile.id = -1 * profile.id);
			profiles = profiles.concat(callAPIMethodResult.response.profiles);
			setProfiles(profiles);
			let replyesWithData = replyes.map(id => profiles.find(profile => profile.id == id));
			console.log("replyesWithData", replyesWithData);
			setRepostsFrom(replyesWithData);
		}
		loadWall();
	}, []);

	const showPosts = (e) => {
		let repostSourceId = e.currentTarget.dataset.repostSourceId;
		setShowRepostsFrom(profiles.find(profile => profile.id == repostSourceId));
		//фокус?
	}

	const openPost = (e) => {
		let postId = Number(e.currentTarget.dataset.postId);
		let postOwnerId = Number(e.currentTarget.dataset.postOwnerId);
		bridge.send("VKWebAppOpenWallPost", { post_id: postId, owner_id: postOwnerId });
	}

	const renderPost = (post) => {
		let text = post.length > MAXPOSTLENGTH ? post.text.substr(0, MAXPOSTLENGTH - 3).concat("...") : post.text;
		let date = new Date(post.date * 1000).toLocaleString();
		let author = profiles.find(profile => profile.id == post.from_id);
		return <Cell
			onClick={openPost} data-post-id={post.id} data-post-owner-id={post.owner_id}
			before={author.photo_100 ? <Avatar src={author.photo_100} /> : null}
			// TODO: УБРАТЬ СЛУЖЕБНУЮ ЗАПИСЬ
			subhead={date || "subhead"}
			multiline>
			{text}
		</Cell>
	}

	const renderPosts = () => {
		return <Group
			header={<Header>Ваши репосты из {showRepostsFrom.name ? showRepostsFrom.name : `${showRepostsFrom.first_name} ${showRepostsFrom.last_name}`}</Header>}>
			{posts.filter(post => post.copy_history?.some(copy => copy.from_id == showRepostsFrom.id)).map(post =>
				renderPost(post)
			)}
		</Group>
	}

	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="home" />}>
				Ваши посты
			</PanelHeader>
			{showRepostsFrom ? renderPosts() : null}
			<Group header={<Header>Откуда вы делали репосты</Header>}>
				{repostsFrom.map(profile =>
					<Cell
						onClick={showPosts} data-repost-source-id={profile.id}
						before={profile.photo_100 ? (
							<Avatar src={profile.photo_100} />) : null}
						description={profile.screen_name}>
						{profile.name ? profile.name : `${profile.first_name} ${profile.last_name}`}
					</Cell>
				)}
			</Group>
		</Panel >
	);
};

Reposts.propTypes = {
	id: PropTypes.string.isRequired,
	apiToken: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	// showPosts: PropTypes.func.isRequired
}

export default Reposts;
