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

const Links = ({ id, apiToken, go }) => {
	const MAXPOSTLENGTH = 300;
	const [posts, setPosts] = useState([]);
	const [links, setLinks] = useState([]);
	// const [showLinksFrom, setShowLinksFrom] = useState(null);


	useEffect(() => {
		//загрузка
		async function loadWall() {
			const callAPIMethodResult = await bridge.send("VKWebAppCallAPIMethod", {
				method: "wall.get",
				params: {
					access_token: apiToken,
					count: 100,
					//extended: 1,
					v: "5.131"
				}
			});
			console.log("callAPIMethodResult", callAPIMethodResult);
			let posts = callAPIMethodResult.response.items
				.filter(post => post.attachments.some(attachment => attachment.type == "link"));
			setPosts(posts);
			let links = [];
			posts.forEach(post =>
				post.attachments.filter(attachment => attachment.type == "link").forEach(attachment =>
					links.push({
						content: attachment.link,
						photo: attachment.link.photo ? attachment.link.photo.sizes.find(photo => photo.type == "p") : null,
						postId: post.id,
						postOwnerId: post.owner_id
					})));
			setLinks(links);
			console.log("links", links);
		}
		loadWall();
	}, []);

	/*const showPosts = (e) => {
		let repostSourceId = e.currentTarget.dataset.repostSourceId;
		setShowRepostsFrom(profiles.find(profile => profile.id == repostSourceId));
		//фокус?
	}*/

	const openPost = (e) => {
		let postId = Number(e.currentTarget.dataset.postId);
		let postOwnerId = Number(e.currentTarget.dataset.postOwnerId);
		bridge.send("VKWebAppOpenWallPost", { post_id: postId, owner_id: postOwnerId });
	}

	/*const renderPost = (post) => {
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
	}*/

	/*const renderPosts = () => {
		return <Group
			header={<Header>Ваши репосты из {showRepostsFrom.name ? showRepostsFrom.name : `${showRepostsFrom.first_name} ${showRepostsFrom.last_name}`}</Header>}>
			{posts.filter(post => post.copy_history?.some(copy => copy.from_id == showRepostsFrom.id)).map(post =>
				renderPost(post)
			)}
		</Group>
	}*/

	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="home" />}>
				Ваши посты
			</PanelHeader>
			{/* {showRepostsFrom ? renderPosts() : null} */}
			<Group header={<Header>Какие ссылки вы добавляли к постам</Header>}>
				{links.map(link =>
					<Cell
						onClick={openPost} data-post-id={link.postId} data-post-owner-id={link.postOwnerId}
						description={link.content.url}>
						{link.photo ? <img src={link.photo.url} width={link.photo.width}></img> : null}
						<Div>{link.content.title}</Div>
					</Cell>
				)}
			</Group>
		</Panel >
	);
};

Links.propTypes = {
	id: PropTypes.string.isRequired,
	apiToken: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	// showPosts: PropTypes.func.isRequired
}

export default Links;
