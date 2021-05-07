/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router';
import Link from './Link';
import { LINKS_PER_PAGE } from '../constants';
import { FEED_QUERY } from '../queries/feed';
import { NEW_VOTES_SUBSCRIPTION } from '../queries/votes';
import { NEW_LINKS_SUBSCRIPTION } from '../queries/links';

const getQueryVariables = (isNewPage, page) => {
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const take = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = { createdAt: 'desc' };
    return { take, skip, orderBy };
};

const getLinksToRender = (isNewPage, data) => {
    if (isNewPage) {
        return data.feed.links;
    }
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort(
        (l1, l2) => l2.votes.length - l1.votes.length,
    );
    return rankedLinks;
};

const LinkList = () => {
    const history = useHistory();
    const isNewPage = history.location.pathname.includes(
        'new',
    );
    const pageIndexParams = history.location.pathname.split(
        '/',
    );
    const page = parseInt(
        pageIndexParams[pageIndexParams.length - 1],
        10,
    );

    const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

    const {
        data,
        loading,
        error,
        subscribeToMore,
    } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page),
    });

    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const { newLink } = subscriptionData.data;
            const exists = prev.feed.links.find(
                ({ id }) => id === newLink.id,
            );
            if (exists) return prev;

            return {
                ...prev,
                feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    // eslint-disable-next-line no-underscore-dangle
                    __typename: prev.feed.__typename,
                },
            };
        },
    });

    subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION,
    });

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
            {data && (
                <>
                    {getLinksToRender(isNewPage, data).map(
                        (link, index) => (
                            <Link
                                key={link.id}
                                link={link}
                                index={index + pageIndex}
                                href={link}
                            />
                        ),
                    )}
                    {isNewPage && (
                        <div className="flex ml4 mv3 gray">
                            <button
                                className="pointer mr2"
                                onClick={() => {
                                    if (page > 1) {
                                        history.push(`/new/${page - 1}`);
                                    }
                                }}
                            >
                                Previous
                            </button>
                            <button
                                className="pointer"
                                onClick={() => {
                                    if (
                                        page
                  <= data.feed.count / LINKS_PER_PAGE
                                    ) {
                                        const nextPage = page + 1;
                                        history.push(`/new/${nextPage}`);
                                    }
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default LinkList;
