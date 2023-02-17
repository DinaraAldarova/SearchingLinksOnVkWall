import React from "react";
import PropTypes from "prop-types";

import {
	Panel,
	PanelHeader,
	Header,
	Button,
	Group,
	Cell,
	Div,
	Avatar,
} from "@vkontakte/vkui";

const Home = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader>Поиск ссылок на стене</PanelHeader>

		{/* <Group header={<Header mode="secondary">Navigation Example</Header>}>
			<Div>
				<Button
					stretched
					size="l"
					mode="secondary"
					onClick={go}
					data-to="persik">
					Show me the Persik, please
				</Button>
			</Div>
		</Group> */}

		<Group header={<Header mode="secondary">Откуда вы делали репосты</Header>}>
			<Div>
				<Button stretched size="l" onClick={go} data-to="reposts">
					Загрузить посты
				</Button>
			</Div>
		</Group>
		<Group header={<Header mode="secondary">Какие ссылки вы добавляли к постам</Header>}>
			<Div>
				<Button stretched size="l" onClick={go} data-to="links">
					Загрузить посты
				</Button>
			</Div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
