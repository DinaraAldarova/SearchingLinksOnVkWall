import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
	View,
	ScreenSpinner,
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	SplitLayout,
	SplitCol,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home";
import Reposts from "./panels/Reposts";
import Links from "./panels/Links";
import ErrorAuth from "./panels/ErrorAuth";
import { func } from "prop-types";

const App = () => {
	// application
	const appId = 51537347;
	const [scheme, setScheme] = useState("bright_light");
	const [activePanel, setActivePanel] = useState("home");
	const [popoutWait, setPopoutWait] = useState(<ScreenSpinner size="large" />);

	// data
	const [apiToken, setApiToken] = useState(null);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === "VKWebAppUpdateConfig") {
				setScheme(data.scheme);
			}
		})


		getApiToken()
			.then(getPosts())
			.then(setPopoutWait(null));
	}, []);

	async function getApiToken() {
		const getAuthTokenResult = await bridge.send("VKWebAppGetAuthToken", {
			app_id: appId,
			scope: "wall",
		});
		setApiToken(getAuthTokenResult.access_token);
		console.log(getAuthTokenResult.access_token);
	};

	async function getPosts() {
		const callAPIMethodResult = await bridge.send("VKWebAppCallAPIMethod", {
			method: "wall.get",
			params: {
				access_token: apiToken,
				count: 100,
				// extended: 1,
				v: "5.131"
			}
		});
		let countPosts = callAPIMethodResult.response.count;
		setPosts(callAPIMethodResult.response.items);
	};

	async function getPosts(count, offset = 0) {
		const callAPIMethodResult = await bridge.send("VKWebAppCallAPIMethod", {
			method: "wall.get",
			params: {
				access_token: apiToken,
				count: count,
				offset: offset,
				v: "5.131"
			}
		});
		return callAPIMethodResult.response.items;
	}

	const go = (e) => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popoutWait}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id="home" fetchedUser={fetchedUser} go={go} />
								<Reposts id="reposts" apiToken={apiToken} go={go} />
								<Links id="links" apiToken={apiToken} go={go} />
								<ErrorAuth id="error_auth" go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
};

export default App;
