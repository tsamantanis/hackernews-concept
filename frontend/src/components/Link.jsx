/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import { useMutation } from '@apollo/client';
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';
import { FEED_QUERY } from '../queries/feed';
import { VOTE_MUTATION } from '../queries/votes';
import { timeDifferenceForDate } from '../utils';

const Link = (props) => {
    const { link, index } = props;
    const authToken = localStorage.getItem(AUTH_TOKEN);

    const take = LINKS_PER_PAGE;
    const skip = 0;
    const orderBy = { createdAt: 'desc' };

    const [vote] = useMutation(VOTE_MUTATION, {
        variables: {
            linkId: link.id,
        },
        update(cache, { data: { vote } }) {
            const { feed } = cache.readQuery({
                query: FEED_QUERY,
                variables: {
                    take,
                    skip,
                    orderBy,
                },
            });

            const updatedLinks = feed.links.map((feedLink) => {
                if (feedLink.id === link.id) {
                    return {
                        ...feedLink,
                        votes: [...feedLink.votes, vote],
                    };
                }
                return feedLink;
            });

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        links: updatedLinks,
                    },
                },
                variables: {
                    take,
                    skip,
                    orderBy,
                },
            });
        },
    });
    return (
        <div className="flex mt2 items-start">
            <div className="flex items-center">
                <span className="gray">
                    {index + 1}
                    .
                </span>
                {authToken && (
                    <button
                        className="ml1 gray f11"
                        style={{ cursor: 'pointer' }}
                        onClick={vote}
                    >
                        ▲
                    </button>
                )}
            </div>
            <div className="ml1">
                <div>
                    {link.description}
                    {' '}
                    (
                    {link.url}
                    )
                </div>
                {authToken && (
                    <div className="f6 lh-copy gray">
                        {link.votes.length}
                        {' '}
                        votes | by
                        {' '}
                        {link.postedBy ? link.postedBy.name : 'Unknown'}
                        {' '}
                        {timeDifferenceForDate(link.createdAt)}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Link;
