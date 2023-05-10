// https://github.com/ppy/osu-api/wiki

declare namespace OsuApiTypes {
    interface MatchGeneralData {
        match_id: string,
        name: string,
        start_time: string,
        end_time: string | null,
    }

    interface MatchGameScoreData {
        slot: string,
        team: '0' | '1' | '2',
        user_id: string,
        score: string,
        maxcombo: string,
        rank: string,
        count50: string,
        count100: string,
        count300: string,
        countmiss: string,
        countgeki: string,
        countkatu: string,
        perfect: string,
        pass: '0' | '1',
        enabled_mods: string | null,
    }

    interface MatchGameData {
        game_id: string,
        start_time: string,
        end_time: string,
        beatmap_id: string,
        play_mode: '0' | '1' | '2' | '3',
        match_type: string,
        scoring_type: '0' | '1' | '2' | '3',
        team_type: '0' | '1' | '2' | '3',
        mods: string,
        scores: MatchGameScoreData[],
    }

    interface MatchResponse {
        match: MatchGeneralData,
        games: MatchGameData[],
    }

    interface BeatmapResponse {
        approved: '-2' | '-1' | '0' | '1' | '2' | '3' | '4',
        submit_date: string,
        approved_date: string,
        last_update: string,
        artist: string,
        beatmap_id: string,
        beatmapset_id: string,
        bpm: string,
        creator: string,
        creator_id: string,
        difficultyrating: string,
        diff_aim: string,
        diff_speed: string,
        diff_size: string,
        diff_overall: string,
        diff_approach: string,
        diff_drain: string,
        hit_length: string,
        source: string,
        genre_id: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '9' | '10' | '11' | '12' | '13' | '14',
        language_id: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14',
        title: string,
        total_length: string,
        version: string,
        file_md5: string,
        mode: string,
        tags: string,
        favourite_count: string,
        rating: string,
        playcount: string,
        passcount: string,
        count_normal: string,
        count_slider: string,
        count_spinner: string,
        max_combo: string,
        storyboard: '0' | '1',
        video: '0' | '1',
        download_unavailable: '0' | '1',
        audio_unavailable: '0' | '1',
    }

    interface BeatmapParams {
        k: string,
        since?: string,
        s?: string,
        b?: string,
        u?: string,
        type?: 'string' | 'id',
        m?: '0' | '1' | '2' | '3',
        a?: '0' | '1',
        h?: string,
        limit?: string,
        mods?: string,
    }

    interface UserEventData {
        display_html: string,
        beatmap_id: string,
        beatmapset_id: string,
        date: string,
        epicfactor: string,
    }

    interface UserResponse {
        user_id: string,
        username: string,
        join_date: string,
        count300: string,
        count100: string,
        count50: string,
        playcount: string,
        ranked_score: string,
        total_score: string,
        pp_rank: string,
        level: string,
        pp_raw: string,
        accuracy: string,
        count_rank_ss: string,
        count_rank_ssh: string,
        count_rank_s: string,
        count_rank_sh: string,
        count_rank_a: string,
        country: string,
        total_seconds_played: string,
        pp_country_rank: string,
        events: UserEventData[],
    }

    interface UserParams {
        k: string,
        u: string,
        m?: '0' | '1' | '2' | '3',
        type?: 'string' | 'id',
        event_days?: string,
    }
}