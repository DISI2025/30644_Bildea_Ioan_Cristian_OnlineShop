import { useMemo } from 'react';
import { useGetRecommendationsForUserQuery, useGetPopularProductsQuery } from '../store/api';
import { RecommendationResponse, DealResponse } from '../types/transfer';

interface UseRecommendationsProps {
    userId?: string;
    limit?: number;
    fallbackToPopular?: boolean;
}

interface UseRecommendationsReturn {
    recommendations: RecommendationResponse | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
    isPersonalized: boolean;
    hasCategories: boolean;
    topCategory: string | null;
}

/**
 * Custom hook for managing product recommendations
 * Automatically falls back to popular products if user has no personalized recommendations
 */
export const useRecommendations = ({
    userId,
    limit = 10,
    fallbackToPopular = true
}: UseRecommendationsProps): UseRecommendationsReturn => {
    
    // Get user-specific recommendations
    const {
        data: userRecommendations,
        isLoading: userLoading,
        error: userError,
        refetch: refetchUser
    } = useGetRecommendationsForUserQuery(
        { userId: userId!, limit },
        { skip: !userId }
    );

    // Extract user recommendations data
    const userRecommendationsData = userRecommendations?.payload;

    // Get popular products as fallback
    const {
        data: popularProducts,
        isLoading: popularLoading,
        error: popularError,
        refetch: refetchPopular
    } = useGetPopularProductsQuery(
        { limit },
        { 
            skip: !fallbackToPopular || !!userRecommendationsData?.recommendedProducts?.length 
        }
    );

    // Extract popular products data
    const popularProductsData = popularProducts?.payload;

    // Determine which data to use
    const recommendations = useMemo(() => {
        if (userRecommendationsData?.recommendedProducts?.length) {
            return userRecommendationsData;
        }
        if (fallbackToPopular && popularProductsData) {
            return popularProductsData;
        }
        return userRecommendationsData;
    }, [userRecommendationsData, popularProductsData, fallbackToPopular]);

    // Determine loading state
    const isLoading = useMemo(() => {
        if (userId) {
            return userLoading;
        }
        return fallbackToPopular ? popularLoading : false;
    }, [userId, userLoading, popularLoading, fallbackToPopular]);

    // Determine error state
    const error = useMemo(() => {
        if (userId && userError) {
            return userError;
        }
        if (fallbackToPopular && popularError) {
            return popularError;
        }
        return null;
    }, [userId, userError, popularError, fallbackToPopular]);

    // Refetch function
    const refetch = () => {
        if (userId) {
            refetchUser();
        }
        if (fallbackToPopular) {
            refetchPopular();
        }
    };

    // Computed properties
    const isPersonalized = recommendations?.recommendationType === 'PERSONALIZED';
    const hasCategories = !!recommendations?.preferredCategories && 
                         Object.keys(recommendations.preferredCategories).length > 0;
    
    const topCategory = useMemo(() => {
        if (!hasCategories || !recommendations?.preferredCategories) return null;
        
        const sortedCategories = Object.entries(recommendations.preferredCategories)
            .sort(([, a], [, b]) => (b as number) - (a as number));
        
        return sortedCategories[0]?.[0] || null;
    }, [hasCategories, recommendations?.preferredCategories]);

    return {
        recommendations,
        isLoading,
        error,
        refetch,
        isPersonalized,
        hasCategories,
        topCategory
    };
};

export default useRecommendations; 